"""
ML Pipeline — model predictions, health scores, and trend analysis.
"""
import uuid
from django.db import models
from django.conf import settings


class HealthScore(models.Model):
    """
    Computed overall health score for a patient, updated periodically.
    Score range: 0–100 (higher is better).
    """
    id      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='health_scores'
    )
    score        = models.DecimalField(max_digits=5, decimal_places=2)  # e.g., 78.50
    risk_level   = models.CharField(
        max_length=10,
        choices=[('LOW','Low'),('MODERATE','Moderate'),('HIGH','High'),('CRITICAL','Critical')],
        default='LOW'
    )
    contributing_factors = models.JSONField(default=list, blank=True)  # [{factor, impact, direction}]
    recommendations      = models.JSONField(default=list, blank=True)
    model_version        = models.CharField(max_length=50, blank=True)
    computed_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'health_scores'
        verbose_name        = 'Health Score'
        verbose_name_plural = 'Health Scores'
        ordering            = ['-computed_at']
        get_latest_by       = 'computed_at'

    def __str__(self):
        return f'Health Score: {self.score} [{self.risk_level}] — {self.patient}'


class MLPrediction(models.Model):
    """
    Generic ML prediction record for any model inference run.
    Used for trend forecasting, anomaly detection, disease risk prediction.
    """
    PREDICTION_TYPES = [
        ('TREND_FORECAST',  'Metric Trend Forecast'),
        ('ANOMALY',         'Anomaly Detection'),
        ('DISEASE_RISK',    'Disease Risk Prediction'),
        ('DRUG_INTERACTION','Drug Interaction Warning'),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ml_predictions'
    )
    prediction_type = models.CharField(max_length=30, choices=PREDICTION_TYPES)
    input_data      = models.JSONField(default=dict)       # Features used for prediction
    output_data     = models.JSONField(default=dict)       # Prediction result
    confidence      = models.FloatField(blank=True, null=True)  # 0.0 - 1.0
    model_name      = models.CharField(max_length=100, blank=True)
    model_version   = models.CharField(max_length=50, blank=True)
    is_flagged      = models.BooleanField(default=False)   # Needs review
    predicted_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'ml_predictions'
        verbose_name        = 'ML Prediction'
        verbose_name_plural = 'ML Predictions'
        ordering            = ['-predicted_at']

    def __str__(self):
        return f'[{self.prediction_type}] {self.model_name} — {self.patient}'
