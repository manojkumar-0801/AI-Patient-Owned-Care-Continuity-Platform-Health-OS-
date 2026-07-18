"""
Doctor profiles, specializations, and verification data.
"""
import uuid
from django.db import models
from django.conf import settings


class DoctorProfile(models.Model):
    """Extended profile for doctor users (role=DOCTOR)."""

    id   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_profile'
    )

    # Professional details
    specialization       = models.CharField(max_length=200, blank=True)
    sub_specialization   = models.CharField(max_length=200, blank=True)
    license_number       = models.CharField(max_length=100, unique=True, blank=True)
    medical_council      = models.CharField(max_length=200, blank=True)  # e.g., 'MCI India'
    years_of_experience  = models.PositiveIntegerField(default=0)
    qualification        = models.CharField(max_length=300, blank=True)  # e.g., 'MBBS, MD'

    # Affiliation
    hospital_name    = models.CharField(max_length=300, blank=True)
    hospital_address = models.TextField(blank=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    # Verification
    is_verified          = models.BooleanField(default=False)
    verification_docs    = models.JSONField(default=list, blank=True)  # S3 keys of uploaded docs
    verified_at          = models.DateTimeField(blank=True, null=True)
    verified_by          = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='verified_doctors'
    )

    # Availability
    is_accepting_patients = models.BooleanField(default=True)
    bio                   = models.TextField(blank=True)
    languages_spoken      = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'doctor_profiles'
        verbose_name        = 'Doctor Profile'
        verbose_name_plural = 'Doctor Profiles'

    def __str__(self):
        return f'Dr. {self.user.full_name} — {self.specialization}'

    @property
    def display_name(self):
        return f'Dr. {self.user.full_name}'
