from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone

from apps.accounts.permissions import IsPatient
from apps.core.responses import SuccessResponse, ErrorResponse
from .models import MedicalDocument, ShareToken, AccessLog
from .serializers import (
    MedicalDocumentSerializer, 
    DocumentUploadSerializer, 
    ShareTokenSerializer, 
    AccessLogSerializer
)


class MedicalDocumentViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoints for Patient Medical Documents.
    """
    permission_classes = [IsAuthenticated, IsPatient]

    def get_queryset(self):
        # Only return non-deleted documents for the authenticated patient
        qs = MedicalDocument.objects.filter(patient=self.request.user, deleted_at__isnull=True)
        
        # Filtering
        category = self.request.query_params.get('category')
        upload_status = self.request.query_params.get('status')
        if category:
            qs = qs.filter(category=category)
        if upload_status:
            qs = qs.filter(upload_status=upload_status)
            
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentUploadSerializer
        return MedicalDocumentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Save the file and set original metadata
            doc = serializer.save(
                patient=request.user,
                file_original_name=request.data.get('file').name if request.data.get('file') else '',
                file_size_bytes=request.data.get('file').size if request.data.get('file') else 0
            )
            # Return standard serializer for the response
            return SuccessResponse(
                data=MedicalDocumentSerializer(doc).data, 
                status_code=status.HTTP_201_CREATED, 
                message='Document uploaded successfully.'
            )
        return ErrorResponse(message='Validation Error', details=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        """Soft delete the document."""
        instance = self.get_object()
        instance.deleted_at = timezone.now()
        instance.save(update_fields=['deleted_at'])
        return SuccessResponse(message='Document deleted successfully.', status_code=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Return the URL to the file for download."""
        instance = self.get_object()
        if not instance.file:
            return ErrorResponse(message='No file attached to this document.', status_code=404)
        return SuccessResponse(data={'download_url': instance.file.url})


class ShareTokenViewSet(viewsets.ModelViewSet):
    """
    Endpoints for generating and managing secure document share links.
    """
    permission_classes = [IsAuthenticated, IsPatient]
    serializer_class = ShareTokenSerializer

    def get_queryset(self):
        return ShareToken.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Revoke a token instead of hard deleting."""
        instance = self.get_object()
        instance.is_revoked = True
        instance.revoked_at = timezone.now()
        instance.save(update_fields=['is_revoked', 'revoked_at'])
        return SuccessResponse(message='Share token revoked.', status_code=204)

    @action(detail=False, methods=['get'], url_path='logs')
    def view_logs(self, request):
        """View access logs for all of the patient's share tokens."""
        logs = AccessLog.objects.filter(token__patient=request.user)
        serializer = AccessLogSerializer(logs, many=True)
        return SuccessResponse(data=serializer.data)


class PublicShareAccessView(viewsets.ViewSet):
    """
    Public access endpoint (Requires no JWT, just the valid token in the URL).
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='(?P<token_uuid>[^/.]+)')
    def access_shared_records(self, request, token_uuid=None):
        try:
            token_obj = ShareToken.objects.get(token=token_uuid, is_revoked=False)
        except ShareToken.DoesNotExist:
            return ErrorResponse(message='Invalid or revoked share token.', status_code=404)

        if token_obj.expiry_at < timezone.now():
            return ErrorResponse(message='Share token has expired.', status_code=403)

        if token_obj.max_access_count and token_obj.access_count >= token_obj.max_access_count:
            return ErrorResponse(message='Share token has reached its maximum access limit.', status_code=403)

        # Log the access
        AccessLog.objects.create(
            token=token_obj,
            accessor_ip=request.META.get('REMOTE_ADDR'),
            accessor_ua=request.META.get('HTTP_USER_AGENT', '')
        )
        token_obj.access_count += 1
        token_obj.save(update_fields=['access_count'])

        # Return the documents based on scope
        qs = MedicalDocument.objects.filter(patient=token_obj.patient, deleted_at__isnull=True)
        if token_obj.scope == ShareToken.SCOPE_SINGLE and token_obj.document_ids:
            qs = qs.filter(id__in=token_obj.document_ids)
        elif token_obj.scope == ShareToken.SCOPE_CATEGORY and token_obj.category_filter:
            qs = qs.filter(category__in=token_obj.category_filter)

        return SuccessResponse(data={
            'patient_name': token_obj.patient.full_name,
            'documents': MedicalDocumentSerializer(qs, many=True).data
        })
