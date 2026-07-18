"""
Appointments — doctor-patient consultation scheduling.
"""
import uuid
from django.db import models
from django.conf import settings


class AppointmentStatus(models.TextChoices):
    REQUESTED  = 'REQUESTED',  'Requested'
    CONFIRMED  = 'CONFIRMED',  'Confirmed'
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    COMPLETED  = 'COMPLETED',  'Completed'
    CANCELLED  = 'CANCELLED',  'Cancelled'
    NO_SHOW    = 'NO_SHOW',    'No Show'


class AppointmentType(models.TextChoices):
    IN_PERSON  = 'IN_PERSON',  'In Person'
    TELECONSULT = 'TELECONSULT', 'Teleconsultation'
    HOME_VISIT = 'HOME_VISIT', 'Home Visit'


class Appointment(models.Model):
    """A scheduled consultation between a patient and a doctor."""

    id      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_appointments'
    )
    doctor  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_appointments'
    )

    appointment_type   = models.CharField(max_length=20, choices=AppointmentType.choices, default=AppointmentType.IN_PERSON)
    status             = models.CharField(max_length=20, choices=AppointmentStatus.choices, default=AppointmentStatus.REQUESTED)
    scheduled_at       = models.DateTimeField()
    duration_minutes   = models.PositiveIntegerField(default=30)
    reason             = models.TextField(blank=True)         # Patient's chief complaint
    notes              = models.TextField(blank=True)         # Doctor's notes (post-consult)
    diagnosis          = models.TextField(blank=True)
    follow_up_required = models.BooleanField(default=False)
    follow_up_date     = models.DateField(blank=True, null=True)

    # Shared records at appointment time
    shared_token = models.ForeignKey(
        'medical_records.ShareToken',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='appointments'
    )

    # Cancellation
    cancelled_by     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='cancelled_appointments'
    )
    cancellation_reason = models.CharField(max_length=500, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'appointments'
        verbose_name        = 'Appointment'
        verbose_name_plural = 'Appointments'
        ordering            = ['-scheduled_at']
        indexes             = [
            models.Index(fields=['patient', 'status'], name='idx_appt_patient_status'),
            models.Index(fields=['doctor', 'status'],  name='idx_appt_doctor_status'),
            models.Index(fields=['-scheduled_at'],     name='idx_appt_scheduled'),
        ]

    def __str__(self):
        return f'Appt: {self.patient} ↔ {self.doctor} @ {self.scheduled_at}'
