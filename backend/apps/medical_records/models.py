"""
Medical records / Health Vault — core document storage models.
"""
import uuid
from django.db import models
from django.conf import settings


class DocumentCategory(models.TextChoices):
    LAB_REPORT        = 'LAB_REPORT',        'Lab Report'
    PRESCRIPTION      = 'PRESCRIPTION',      'Prescription'
    RADIOLOGY         = 'RADIOLOGY',         'Radiology / Imaging'
    DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY', 'Discharge Summary'
    VACCINATION       = 'VACCINATION',       'Vaccination'
    DENTAL            = 'DENTAL',            'Dental'
    OPHTHALMOLOGY     = 'OPHTHALMOLOGY',     'Ophthalmology'
    CARDIOLOGY        = 'CARDIOLOGY',        'Cardiology'
    OTHER             = 'OTHER',             'Other'


class UploadStatus(models.TextChoices):
    UPLOADED   = 'UPLOADED',   'Uploaded'
    PROCESSING = 'PROCESSING', 'Processing'
    READY      = 'READY',      'Ready'
    FAILED     = 'FAILED',     'Failed'


class MedicalDocument(models.Model):
    """Core document model — the patient's health vault entry."""

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name='medical_documents'
    )

    # Document metadata
    title         = models.CharField(max_length=500)
    description   = models.TextField(blank=True)
    category      = models.CharField(max_length=30, choices=DocumentCategory.choices, default=DocumentCategory.OTHER)
    document_date = models.DateField(blank=True, null=True)  # Date on the report itself

    # Provider info
    provider_name = models.CharField(max_length=300, blank=True)
    provider_type = models.CharField(
        max_length=20,
        choices=[('HOSPITAL','Hospital'),('LAB','Laboratory'),('CLINIC','Clinic'),('PHARMACY','Pharmacy'),('OTHER','Other')],
        blank=True
    )

    # File storage (S3)
    file_s3_key       = models.CharField(max_length=1000)
    file_original_name = models.CharField(max_length=500, blank=True)
    file_type         = models.CharField(max_length=10, choices=[('PDF','PDF'),('JPG','JPG'),('PNG','PNG'),('HEIC','HEIC')], blank=True)
    file_size_bytes   = models.BigIntegerField(default=0)

    # Processing state
    upload_status = models.CharField(max_length=20, choices=UploadStatus.choices, default=UploadStatus.UPLOADED)
    is_encrypted  = models.BooleanField(default=True)
    tags          = models.JSONField(default=list, blank=True)

    # Timestamps / soft delete
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table            = 'medical_documents'
        verbose_name        = 'Medical Document'
        verbose_name_plural = 'Medical Documents'
        ordering            = ['-document_date', '-created_at']
        indexes             = [
            models.Index(fields=['patient', 'deleted_at'], name='idx_docs_patient'),
            models.Index(fields=['category'],              name='idx_docs_category'),
            models.Index(fields=['-document_date'],        name='idx_docs_date'),
            models.Index(fields=['upload_status'],         name='idx_docs_status'),
        ]

    def __str__(self):
        return f'{self.title} [{self.category}] — {self.patient}'

    @property
    def is_ready(self):
        return self.upload_status == UploadStatus.READY

    @property
    def is_deleted(self):
        return self.deleted_at is not None


class ShareToken(models.Model):
    """Consent-based secure record sharing tokens."""

    SCOPE_SINGLE   = 'SINGLE_DOC'
    SCOPE_CATEGORY = 'CATEGORY'
    SCOPE_FULL     = 'FULL_PROFILE'
    SCOPE_CHOICES  = [
        (SCOPE_SINGLE,   'Single Document'),
        (SCOPE_CATEGORY, 'Category'),
        (SCOPE_FULL,     'Full Profile'),
    ]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token         = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    patient       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='share_tokens'
    )
    document_ids     = models.JSONField(default=list, blank=True)   # List of UUIDs
    category_filter  = models.JSONField(default=list, blank=True)
    scope            = models.CharField(max_length=20, choices=SCOPE_CHOICES, default=SCOPE_FULL)
    expiry_at        = models.DateTimeField()
    is_revoked       = models.BooleanField(default=False)
    revoked_at       = models.DateTimeField(blank=True, null=True)
    max_access_count = models.IntegerField(blank=True, null=True)
    access_count     = models.IntegerField(default=0)
    notes            = models.CharField(max_length=500, blank=True)
    created_by_ip    = models.GenericIPAddressField(blank=True, null=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'share_tokens'
        verbose_name        = 'Share Token'
        verbose_name_plural = 'Share Tokens'
        ordering            = ['-created_at']

    def __str__(self):
        return f'ShareToken {self.token} [{self.scope}] — expires {self.expiry_at}'


class AccessLog(models.Model):
    """Immutable audit trail for every share token access."""

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token            = models.ForeignKey(ShareToken, on_delete=models.CASCADE, related_name='access_logs')
    accessor_ip      = models.GenericIPAddressField(blank=True, null=True)
    accessor_ua      = models.TextField(blank=True)   # User-Agent
    documents_viewed = models.JSONField(default=list)
    accessed_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'access_logs'
        verbose_name        = 'Access Log'
        verbose_name_plural = 'Access Logs'
        ordering            = ['-accessed_at']

    def __str__(self):
        return f'Access {self.accessed_at} by {self.accessor_ip}'
