from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from apps.accounts.permissions import IsPatient
from apps.core.responses import SuccessResponse, ErrorResponse
from .models import PatientProfile, HealthMetric
from .serializers import PatientProfileSerializer, HealthMetricSerializer


class PatientProfileView(APIView):
    """
    GET   /api/v1/patients/profile/
    PATCH /api/v1/patients/profile/
    """
    permission_classes = [IsAuthenticated, IsPatient]

    @extend_schema(responses={200: PatientProfileSerializer}, tags=['Patient Profile'])
    def get(self, request):
        profile, _ = PatientProfile.objects.get_or_create(user=request.user)
        serializer = PatientProfileSerializer(profile)
        return SuccessResponse(data=serializer.data)

    @extend_schema(request=PatientProfileSerializer, tags=['Patient Profile'])
    def patch(self, request):
        profile, _ = PatientProfile.objects.get_or_create(user=request.user)
        serializer = PatientProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return SuccessResponse(data=serializer.data, message='Patient profile updated successfully.')
        return ErrorResponse(message='Invalid data', details=serializer.errors)


class HealthMetricListView(APIView):
    """
    GET  /api/v1/patients/metrics/
    POST /api/v1/patients/metrics/
    """
    permission_classes = [IsAuthenticated, IsPatient]

    @extend_schema(responses={200: HealthMetricSerializer(many=True)}, tags=['Health Metrics'])
    def get(self, request):
        metrics = HealthMetric.objects.filter(patient=request.user)
        
        # Optional filtering
        metric_name = request.query_params.get('metric_name')
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        if metric_name:
            metrics = metrics.filter(metric_name__iexact=metric_name)
        if from_date:
            metrics = metrics.filter(recorded_at__gte=from_date)
        if to_date:
            metrics = metrics.filter(recorded_at__lte=to_date)

        serializer = HealthMetricSerializer(metrics, many=True)
        return SuccessResponse(data=serializer.data)

    @extend_schema(request=HealthMetricSerializer, tags=['Health Metrics'])
    def post(self, request):
        serializer = HealthMetricSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=request.user)
            return SuccessResponse(data=serializer.data, status_code=status.HTTP_201_CREATED, message='Metric added.')
        return ErrorResponse(message='Invalid data', details=serializer.errors)


class AvailableMetricsView(APIView):
    """
    GET /api/v1/patients/metrics/available/
    Returns a distinct list of metric names available for the authenticated patient.
    """
    permission_classes = [IsAuthenticated, IsPatient]

    @extend_schema(tags=['Health Metrics'])
    def get(self, request):
        metric_names = HealthMetric.objects.filter(patient=request.user).values_list('metric_name', flat=True).distinct()
        return SuccessResponse(data={'available_metrics': list(metric_names)})
