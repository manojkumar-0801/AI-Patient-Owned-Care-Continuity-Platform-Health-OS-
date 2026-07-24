from django.contrib import admin
from .models import PatientProfile, HealthMetric


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'patient_id', 'national_health_id', 'data_sharing_consent')
    search_fields = ('user__email', 'patient_id', 'national_health_id')
    list_filter = ('data_sharing_consent',)
    readonly_fields = ('patient_id', 'created_at', 'updated_at')
    list_select_related = ('user',)
    list_per_page = 25


@admin.register(HealthMetric)
class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ('patient', 'metric_name', 'metric_value', 'metric_unit', 'is_abnormal', 'recorded_at', 'source')
    search_fields = ('patient__email', 'metric_name')
    list_filter = ('is_abnormal', 'source', 'metric_name')
    date_hierarchy = 'recorded_at'
    list_select_related = ('patient',)
    list_per_page = 25
    readonly_fields = ('created_at',)
