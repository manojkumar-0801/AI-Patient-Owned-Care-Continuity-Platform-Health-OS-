"""
Signal handlers for the Authentication app.

Signals:
    - post_save on User: Log user creation events.
"""
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()


@receiver(post_save, sender=User)
def log_user_creation(sender, instance, created, **kwargs):
    """Log when a new user account is created."""
    if created:
        logger.info(
            'New user account created | id=%s | email=%s | role=%s',
            instance.id, instance.email, instance.role
        )
