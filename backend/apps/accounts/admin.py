"""
Django Admin registration for Authentication models.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    """Inline UserProfile inside User admin."""
    model          = UserProfile
    can_delete     = False
    verbose_name   = 'Health Profile'
    fk_name        = 'user'
    extra          = 0
    fieldsets      = (
        ('Personal', {
            'fields': ('first_name', 'last_name', 'date_of_birth', 'gender')
        }),
        ('Health Info', {
            'fields': ('blood_type', 'allergies', 'chronic_conditions', 'current_medications')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_name', 'emergency_phone', 'emergency_relation')
        }),
    )


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin view for Health OS User model."""

    inlines        = [UserProfileInline]
    list_display   = ['email', 'role', 'is_active', 'is_verified', 'mfa_enabled', 'created_at']
    list_filter    = ['role', 'is_active', 'is_verified', 'mfa_enabled']
    search_fields  = ['email', 'phone']
    ordering       = ['-created_at']
    readonly_fields = ['id', 'last_login', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('id', 'email', 'phone', 'password')
        }),
        (_('Role & Status'), {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'is_verified')
        }),
        (_('MFA'), {
            'fields': ('mfa_enabled', 'mfa_secret'),
            'classes': ('collapse',),
        }),
        (_('Permissions'), {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',),
        }),
        (_('Timestamps'), {
            'fields': ('last_login_at', 'created_at', 'updated_at'),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin view for UserProfile model."""
    list_display  = ['user', 'full_name', 'blood_type', 'gender']
    search_fields = ['user__email', 'first_name', 'last_name']
    readonly_fields = ['user', 'created_at', 'updated_at']
