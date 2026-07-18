"""
Patient profiles and health-specific data.
Extends the base accounts.User model for patient-specific information.
"""
import uuid
from django.db import models
from django.conf import settings


class PatientProfile(models.Model):
    """
    Extended patient information beyond the base User model.
    Links 1:1 with accounts.User where role=PATIENT.
    """
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_profile'
    )

    # Health identifiers
    patient_id         = models.CharField(max_length=20, unique=True, blank=True)  # e.g., PAT-00001
    national_health_id = models.CharField(max_length=50, unique=True, blank=True, null=True)

    # Insurance
    insurance_provider    = models.CharField(max_length=200, blank=True)
    insurance_policy_no   = models.CharField(max_length=100, blank=True)
    insurance_expiry_date = models.DateField(blank=True, null=True)

    # Consent
    data_sharing_consent  = models.BooleanField(default=False)
    consent_date          = models.DateTimeField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'patient_profiles'
        verbose_name        = 'Patient Profile'
        verbose_name_plural = 'Patient Profiles'

    def __str__(self):
        return f'Patient: {self.user.email} [{self.patient_id}]'

    def save(self, *args, **kwargs):
        if not self.patient_id:
            count = PatientProfile.objects.count() + 1
            self.patient_id = f'PAT-{count:05d}'
        super().save(*args, **kwargs)


class HealthMetric(models.Model):
    """Structured health metric data points extracted from medical records."""

    SOURCE_DOCUMENT = 'DOCUMENT'
    SOURCE_MANUAL   = 'MANUAL'
    SOURCE_DEVICE   = 'DEVICE'
    SOURCE_CHOICES  = [
        (SOURCE_DOCUMENT, 'Document'),
        (SOURCE_MANUAL,   'Manual Entry'),
        (SOURCE_DEVICE,   'Wearable Device'),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='health_metrics'
    )
    metric_name  = models.CharField(max_length=100)   # e.g., 'HbA1c', 'Systolic BP'
    metric_value = models.DecimalField(max_digits=10, decimal_places=4)
    metric_unit  = models.CharField(max_length=50, blank=True)  # e.g., '%', 'mg/dL'
    normal_min   = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    normal_max   = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    is_abnormal  = models.BooleanField(default=False)
    recorded_at  = models.DateField()
    source       = models.CharField(max_length=20, choices=SOURCE_CHOICES, default=SOURCE_DOCUMENT)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'health_metrics'
        verbose_name        = 'Health Metric'
        verbose_name_plural = 'Health Metrics'
        ordering            = ['-recorded_at']
        indexes             = [
            models.Index(fields=['patient', 'metric_name'], name='idx_metrics_patient_metric'),
            models.Index(fields=['-recorded_at'],           name='idx_metrics_recorded_at'),
        ]

    def __str__(self):
        return f'{self.metric_name}: {self.metric_value} {self.metric_unit} ({self.recorded_at})'
