from rest_framework import serializers
from .models import MedicalDocument, ShareToken, AccessLog


class MedicalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalDocument
        fields = [
            'id', 'title', 'description', 'category', 'document_date',
            'provider_name', 'provider_type', 'file_original_name',
            'file_type', 'file_size_bytes', 'upload_status', 'is_encrypted',
            'tags', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'upload_status']


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalDocument
        fields = [
            'title', 'description', 'category', 'document_date',
            'provider_name', 'provider_type', 'file', 'tags'
        ]


class ShareTokenSerializer(serializers.ModelSerializer):
    share_url = serializers.SerializerMethodField()

    class Meta:
        model = ShareToken
        fields = [
            'id', 'token', 'document_ids', 'category_filter', 'scope',
            'expiry_at', 'is_revoked', 'max_access_count', 'access_count',
            'notes', 'created_at', 'share_url'
        ]
        read_only_fields = ['id', 'token', 'access_count', 'created_at']

    def get_share_url(self, obj):
        return f"/share/{str(obj.token)}"


class AccessLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessLog
        fields = ['id', 'accessor_ip', 'accessor_ua', 'documents_viewed', 'accessed_at']
        read_only_fields = fields
