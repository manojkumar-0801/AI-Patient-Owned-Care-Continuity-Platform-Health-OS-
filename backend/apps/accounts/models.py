"""
User and Profile models for Health OS Authentication.

Models:
    - User        → Custom user with UUID PK, email auth, and role
    - UserProfile → Extended patient health info (1:1 with User)
"""
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


# ─── Role Choices ────────────────────────────────────────────────────────────
class UserRole(models.TextChoices):
    PATIENT    = 'PATIENT',    _('Patient')
    DOCTOR     = 'DOCTOR',     _('Doctor')
    STAFF      = 'STAFF',      _('Hospital Staff')
    ADMIN      = 'ADMIN',      _('Admin')
    AI_SERVICE = 'AI_SERVICE', _('AI Service')


class GenderChoices(models.TextChoices):
    MALE            = 'MALE',            _('Male')
    FEMALE          = 'FEMALE',          _('Female')
    OTHER           = 'OTHER',           _('Other')
    PREFER_NOT      = 'PREFER_NOT_TO_SAY', _('Prefer not to say')


class BloodTypeChoices(models.TextChoices):
    A_POS  = 'A+',  'A+'
    A_NEG  = 'A-',  'A-'
    B_POS  = 'B+',  'B+'
    B_NEG  = 'B-',  'B-'
    AB_POS = 'AB+', 'AB+'
    AB_NEG = 'AB-', 'AB-'
    O_POS  = 'O+',  'O+'
    O_NEG  = 'O-',  'O-'


# ─── User Model ──────────────────────────────────────────────────────────────
class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for Health OS.

    - Uses email for authentication (no username).
    - UUID primary key prevents enumeration attacks.
    - Role-based access: PATIENT | DOCTOR | ADMIN.
    - Soft delete via deleted_at timestamp.
    """

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email         = models.EmailField(_('email address'), unique=True, db_index=True)
    phone_number  = models.CharField(_('phone number'), max_length=20, unique=True, blank=True, null=True)
    first_name    = models.CharField(_('first name'), max_length=100)
    last_name     = models.CharField(_('last name'), max_length=100)
    role          = models.CharField(_('role'), max_length=20, choices=UserRole.choices, default=UserRole.PATIENT)

    # Account status
    is_active   = models.BooleanField(_('active'), default=True)
    is_staff    = models.BooleanField(_('staff status'), default=False)
    is_verified = models.BooleanField(_('email verified'), default=False)

    # Timestamps
    created_at    = models.DateTimeField(_('created at'), default=timezone.now)
    updated_at    = models.DateTimeField(_('updated at'), auto_now=True)
    deleted_at    = models.DateTimeField(_('deleted at'), blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = []   # email + password are required by default

    class Meta:
        verbose_name        = _('user')
        verbose_name_plural = _('users')
        ordering            = ['-created_at']
        db_table            = 'users'

    def __str__(self):
        return f'{self.email} ({self.role})'

    # ── Convenience properties ───────────────────────────────────────────────
    @property
    def is_patient(self):
        return self.role == UserRole.PATIENT

    @property
    def is_doctor(self):
        return self.role == UserRole.DOCTOR

    @property
    def is_admin_user(self):
        return self.role == UserRole.ADMIN

    @property
    def full_name(self):
        """Returns full name."""
        return f'{self.first_name} {self.last_name}'.strip()

    def soft_delete(self):
        """Soft-delete the user account."""
        self.deleted_at = timezone.now()
        self.is_active  = False
        self.save(update_fields=['deleted_at', 'is_active'])


# ─── UserProfile Model ───────────────────────────────────────────────────────
class UserProfile(models.Model):
    """
    Extended profile information for a User.

    Linked 1:1 with User model.
    Contains health-specific info: blood type, allergies, emergency contact.
    """

    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='profile', primary_key=True
    )

    # Personal info
    date_of_birth = models.DateField(_('date of birth'), blank=True, null=True)
    gender      = models.CharField(_('gender'), max_length=25, choices=GenderChoices.choices, blank=True)

    # Health info (patient-specific)
    blood_type          = models.CharField(_('blood type'), max_length=5, choices=BloodTypeChoices.choices, blank=True)
    allergies           = models.JSONField(_('allergies'), default=list, blank=True)
    chronic_conditions  = models.JSONField(_('chronic conditions'), default=list, blank=True)
    current_medications = models.JSONField(_('current medications'), default=list, blank=True)

    # Emergency contact
    emergency_name     = models.CharField(_('emergency contact name'), max_length=200, blank=True)
    emergency_phone    = models.CharField(_('emergency contact phone'), max_length=20, blank=True)
    emergency_alt_phone = models.CharField(_('emergency alternate phone'), max_length=20, blank=True)
    emergency_relation = models.CharField(_('emergency contact relation'), max_length=50, blank=True)

    # Avatar
    profile_photo = models.ImageField(_('profile photo'), upload_to='profile_photos/', blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = _('user profile')
        verbose_name_plural = _('user profiles')
        db_table            = 'user_profiles'

    def __str__(self):
        return f'Profile of {self.user.email}'

    @property
    def full_name(self):
        return self.user.full_name

    @property
    def age(self):
        """Calculate age from date_of_birth."""
        if not self.date_of_birth:
            return None
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
