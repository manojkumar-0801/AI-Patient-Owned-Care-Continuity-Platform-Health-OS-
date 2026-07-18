"""
Serializers for Health OS Authentication.

Covers:
    - User registration
    - Custom JWT token pair (includes user data in response)
    - User profile read/update
    - Password change
"""
import re
import logging
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile

logger = logging.getLogger(__name__)
User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────
def validate_phone_number(value):
    """Validate international phone number format."""
    if value and not re.match(r'^\+?[1-9]\d{7,14}$', value):
        raise serializers.ValidationError(
            'Enter a valid phone number (e.g., +919876543210).'
        )
    return value


# ─── Registration ─────────────────────────────────────────────────────────────
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for new user registration.
    Creates both User and UserProfile in one transaction.
    """
    password         = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name       = serializers.CharField(max_length=100)
    last_name        = serializers.CharField(max_length=100)

    class Meta:
        model  = User
        fields = ['email', 'phone', 'password', 'confirm_password', 'role', 'first_name', 'last_name']
        extra_kwargs = {
            'role': {'default': 'PATIENT'},
        }

    def validate_email(self, value):
        """Ensure email is not already registered."""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value.lower()

    def validate_phone(self, value):
        """Validate phone uniqueness and format."""
        if value:
            validate_phone_number(value)
            if User.objects.filter(phone=value).exists():
                raise serializers.ValidationError('An account with this phone number already exists.')
        return value

    def validate_password(self, value):
        """Run Django's built-in password validators."""
        validate_password(value)
        return value

    def validate(self, attrs):
        """Cross-field validation: ensure passwords match."""
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        """Create User + UserProfile atomically."""
        first_name = validated_data.pop('first_name')
        last_name  = validated_data.pop('last_name')

        user = User.objects.create_user(**validated_data)

        # Create profile automatically
        UserProfile.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
        )

        logger.info('New user registered: %s (role: %s)', user.email, user.role)
        return user


# ─── JWT Token Pair (Custom) ──────────────────────────────────────────────────
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends simplejwt TokenObtainPairSerializer to:
    1. Add custom claims to the JWT payload (role, email).
    2. Return user data alongside the tokens in the response.
    """

    @classmethod
    def get_token(cls, user):
        """Add extra claims into the JWT payload."""
        token = super().get_token(user)
        token['email'] = user.email
        token['role']  = user.role
        return token

    def validate(self, attrs):
        """Validate credentials and return tokens + user info."""
        data = super().validate(attrs)

        # Append user info to response
        data['user'] = {
            'id':         str(self.user.id),
            'email':      self.user.email,
            'role':       self.user.role,
            'full_name':  self.user.full_name,
            'is_verified': self.user.is_verified,
        }
        data['token_type'] = 'Bearer'
        return data


# ─── User Profile ─────────────────────────────────────────────────────────────
class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for reading/updating the UserProfile."""

    class Meta:
        model  = UserProfile
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'blood_type', 'allergies', 'chronic_conditions', 'current_medications',
            'emergency_name', 'emergency_phone', 'emergency_relation',
            'profile_photo_url', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """
    Full user serializer — used for GET /me/ responses.
    Nests the UserProfile for a single comprehensive response.
    """
    profile = UserProfileSerializer(read_only=True)
    age     = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            'id', 'email', 'phone', 'role',
            'is_active', 'is_verified', 'mfa_enabled',
            'last_login_at', 'created_at',
            'profile', 'age',
        ]
        read_only_fields = [
            'id', 'email', 'role', 'is_active', 'is_verified',
            'mfa_enabled', 'last_login_at', 'created_at',
        ]

    def get_age(self, obj):
        try:
            return obj.profile.age
        except UserProfile.DoesNotExist:
            return None


class UpdateMeSerializer(serializers.Serializer):
    """
    Serializer for PATCH /me/ — allows updating phone + profile fields together.
    """
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    # Profile fields
    first_name          = serializers.CharField(max_length=100, required=False)
    last_name           = serializers.CharField(max_length=100, required=False)
    date_of_birth       = serializers.DateField(required=False, allow_null=True)
    gender              = serializers.ChoiceField(
        choices=['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], required=False, allow_blank=True
    )
    blood_type          = serializers.ChoiceField(
        choices=['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required=False, allow_blank=True
    )
    allergies           = serializers.ListField(child=serializers.CharField(), required=False)
    chronic_conditions  = serializers.ListField(child=serializers.CharField(), required=False)
    current_medications = serializers.ListField(child=serializers.CharField(), required=False)
    emergency_name      = serializers.CharField(max_length=200, required=False, allow_blank=True)
    emergency_phone     = serializers.CharField(max_length=20, required=False, allow_blank=True)
    emergency_relation  = serializers.CharField(max_length=50, required=False, allow_blank=True)
    profile_photo_url   = serializers.URLField(required=False, allow_blank=True)

    def validate_phone(self, value):
        if value:
            validate_phone_number(value)
        return value

    def update(self, instance, validated_data):
        """Update User and UserProfile fields."""
        # User-level field
        phone = validated_data.pop('phone', None)
        if phone is not None:
            instance.phone = phone
            instance.save(update_fields=['phone'])

        # Profile-level fields
        profile_fields = list(validated_data.keys())
        if profile_fields:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            for field in profile_fields:
                setattr(profile, field, validated_data[field])
            profile.save(update_fields=profile_fields)

        return instance


# ─── Password Change ──────────────────────────────────────────────────────────
class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for authenticated password change."""
    current_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    new_password     = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'New passwords do not match.'})
        return attrs


# ─── Logout ───────────────────────────────────────────────────────────────────
class LogoutSerializer(serializers.Serializer):
    """Serializer for logout — accepts refresh token to blacklist."""
    refresh_token = serializers.CharField()

    def validate_refresh_token(self, value):
        try:
            RefreshToken(value)
        except Exception:
            raise serializers.ValidationError('Invalid or expired refresh token.')
        return value
