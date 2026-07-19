"""
Core API Views.
"""
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework import serializers

class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField(default="healthy")
    service = serializers.CharField(default="Health OS API")
    version = serializers.CharField(default="1.0.0")

class HealthCheckAPIView(APIView):
    """
    Health check endpoint to verify the API is running.
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        summary="API Health Check",
        description="Returns the health status of the API.",
        responses={200: HealthCheckSerializer}
    )
    def get(self, request, *args, **kwargs):
        return Response({
            "status": "healthy",
            "service": "Health OS API",
            "version": "1.0.0"
        })
