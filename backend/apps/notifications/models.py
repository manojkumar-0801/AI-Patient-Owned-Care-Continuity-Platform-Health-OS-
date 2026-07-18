"""
Notifications — in-app and push notification system.
"""
import uuid
from django.db import models
from django.conf import settings


class NotificationType(models.TextChoices):
    AI_SUMMARY_READY  = 'AI_SUMMARY_READY',  'AI Summary Ready'
    ABNORMAL_VALUE    = 'ABNORMAL_VALUE',    'Abnormal Value Detected'
    RECORD_ACCESSED   = 'RECORD_ACCESSED',   'Record Accessed'
    SHARE_EXPIRING    = 'SHARE_EXPIRING',    'Share Link Expiring'
    APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER', 'Appointment Reminder'
    APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED', 'Appointment Confirmed'
    APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED', 'Appointment Cancelled'
    SYSTEM            = 'SYSTEM',            'System Notification'


class Notification(models.Model):
    """In-app notification for a user."""

    id      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type        = models.CharField(max_length=30, choices=NotificationType.choices)
    title       = models.CharField(max_length=200)
    body        = models.TextField()
    data        = models.JSONField(default=dict, blank=True)  # Extra context (doc_id, etc.)
    is_read     = models.BooleanField(default=False)
    read_at     = models.DateTimeField(blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'notifications'
        verbose_name        = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering            = ['-created_at']
        indexes             = [
            models.Index(fields=['user', 'is_read'], name='idx_notif_user_read'),
        ]

    def __str__(self):
        return f'[{self.type}] {self.title} → {self.user}'

    def mark_read(self):
        from django.utils import timezone
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
