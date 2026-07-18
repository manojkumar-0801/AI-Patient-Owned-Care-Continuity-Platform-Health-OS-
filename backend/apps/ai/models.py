"""
AI Engine — OCR processing results and LLM report summaries.
"""
import uuid
from django.db import models


class ProcessingStatus(models.TextChoices):
    PENDING    = 'PENDING',    'Pending'
    PROCESSING = 'PROCESSING', 'Processing'
    COMPLETED  = 'COMPLETED',  'Completed'
    FAILED     = 'FAILED',     'Failed'


class AISummary(models.Model):
    """
    AI-generated summary for a medical document.
    Populated asynchronously by Celery worker after OCR + LLM processing.
    """
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document    = models.OneToOneField(
        'medical_records.MedicalDocument',
        on_delete=models.CASCADE,
        related_name='ai_summary'
    )

    # OCR output
    ocr_raw_text    = models.TextField(blank=True)        # Raw OCR extracted text
    ocr_confidence  = models.FloatField(blank=True, null=True)  # 0.0 - 1.0

    # LLM output
    summary_text       = models.TextField(blank=True)     # Plain-language summary
    key_findings       = models.JSONField(default=list, blank=True)  # List of strings
    abnormal_flags     = models.JSONField(default=list, blank=True)  # [{metric, value, status}]
    extracted_values   = models.JSONField(default=dict, blank=True)  # {metric: {value, unit}}
    recommendations    = models.JSONField(default=list, blank=True)  # Doctor tips

    # Processing metadata
    model_used            = models.CharField(max_length=100, blank=True)  # e.g., 'gpt-4o'
    llm_prompt_tokens     = models.IntegerField(default=0)
    llm_completion_tokens = models.IntegerField(default=0)
    processing_time_ms    = models.IntegerField(default=0)
    status                = models.CharField(max_length=20, choices=ProcessingStatus.choices, default=ProcessingStatus.PENDING)
    error_message         = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'ai_summaries'
        verbose_name        = 'AI Summary'
        verbose_name_plural = 'AI Summaries'

    def __str__(self):
        return f'AI Summary for: {self.document.title} [{self.status}]'

    @property
    def is_complete(self):
        return self.status == ProcessingStatus.COMPLETED

    @property
    def has_abnormal_findings(self):
        return len(self.abnormal_flags) > 0
