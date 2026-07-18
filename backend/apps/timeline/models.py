"""
Timeline — aggregated health event feed for a patient.
Combines medical records, appointments, AI summaries into a chronological view.
"""
import uuid
from django.db import models
from django.conf import settings


class TimelineEventType(models.TextChoices):
    DOCUMENT    = 'DOCUMENT',    'Medical Document'
    APPOINTMENT = 'APPOINTMENT', 'Appointment'
    AI_SUMMARY  = 'AI_SUMMARY',  'AI Insight'
    METRIC      = 'METRIC',      'Health Metric'
    VACCINATION = 'VACCINATION', 'Vaccination'
    NOTE        = 'NOTE',        'Personal Note'


class TimelineEvent(models.Model):
    """
    A denormalized, pre-aggregated health event for fast timeline rendering.
    Populated by signals from other apps (medical_records, appointments, ai).
    """
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='timeline_events'
    )
    event_type  = models.CharField(max_length=20, choices=TimelineEventType.choices)
    event_date  = models.DateField()
    title       = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    icon        = models.CharField(max_length=50, blank=True)  # icon identifier for frontend

    # Generic FK to source object
    source_app  = models.CharField(max_length=50, blank=True)   # e.g., 'medical_records'
    source_id   = models.UUIDField(blank=True, null=True)       # ID of source object
    metadata    = models.JSONField(default=dict, blank=True)    # Extra data for frontend

    is_pinned   = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'timeline_events'
        verbose_name        = 'Timeline Event'
        verbose_name_plural = 'Timeline Events'
        ordering            = ['-event_date', '-created_at']
        indexes             = [
            models.Index(fields=['patient', '-event_date'], name='idx_timeline_patient_date'),
            models.Index(fields=['event_type'],             name='idx_timeline_type'),
        ]

    def __str__(self):
        return f'[{self.event_type}] {self.title} — {self.event_date}'
