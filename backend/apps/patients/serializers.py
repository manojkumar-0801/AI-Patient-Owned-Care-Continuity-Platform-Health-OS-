from rest_framework import serializers
from .models import PatientProfile, HealthMetric


class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = [
            'patient_id', 'national_health_id',
            'insurance_provider', 'insurance_policy_no', 'insurance_expiry_date',
            'data_sharing_consent', 'consent_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['patient_id', 'created_at', 'updated_at']


class HealthMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthMetric
        fields = [
            'id', 'metric_name', 'metric_value', 'metric_unit',
            'normal_min', 'normal_max', 'is_abnormal',
            'recorded_at', 'source', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'source']

    def create(self, validated_data):
        # Default source for API-created metrics is MANUAL
        validated_data['source'] = HealthMetric.SOURCE_MANUAL
        return super().create(validated_data)

