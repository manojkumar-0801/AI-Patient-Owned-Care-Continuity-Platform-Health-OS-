"""
Django Admin registration for Authentication models.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import CustomUser, UserProfile


class UserProfileInline(admin.StackedInline):
    """Inline UserProfile inside CustomUser admin."""
    model          = UserProfile
    can_delete     = False
    verbose_name_plural   = 'Profile'
    fk_name        = 'user'
    extra          = 0
    fieldsets      = (
        ('Personal Info', {
            'fields': ('date_of_birth', 'gender')
        }),
        ('Health Info', {
            'fields': ('blood_type', 'allergies', 'chronic_conditions', 'current_medications')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_name', 'emergency_phone', 'emergency_relation')
        }),
    )


@admin.register(CustomUser)
class UserAdmin(BaseUserAdmin):
    """Custom admin view for Health OS User model."""

    inlines        = [UserProfileInline]
    list_display   = ['email', 'role', 'is_active', 'is_verified', 'created_at']
    list_filter    = ['role', 'is_active', 'is_verified']
    search_fields  = ['email', 'phone_number', 'first_name', 'last_name']
    ordering       = ['-created_at']
    readonly_fields = ['id', 'last_login', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('id', 'email', 'phone_number', 'password', 'first_name', 'last_name')
        }),
        (_('Role & Status'), {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'is_verified')
        }),
        (_('Permissions'), {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',),
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone_number', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin view for UserProfile model."""
    list_display  = ['user', 'full_name', 'blood_type', 'gender']
    search_fields = ['user__email']
    readonly_fields = ['user', 'created_at', 'updated_at']
