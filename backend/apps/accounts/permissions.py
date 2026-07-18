"""
Custom DRF Permission classes for Role-Based Access Control (RBAC).

Usage in views:
    permission_classes = [IsAuthenticated, IsPatient]
    permission_classes = [IsAuthenticated, IsDoctor | IsAdmin]
"""
from rest_framework.permissions import BasePermission


class IsPatient(BasePermission):
    """
    Grants access only to authenticated users with role PATIENT.
    """
    message = 'Access restricted to patient accounts only.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'PATIENT'
        )


class IsDoctor(BasePermission):
    """
    Grants access only to authenticated users with role DOCTOR.
    """
    message = 'Access restricted to doctor accounts only.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'DOCTOR'
        )


class IsAdmin(BasePermission):
    """
    Grants access only to authenticated users with role ADMIN.
    """
    message = 'Access restricted to admin accounts only.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'ADMIN'
        )


class IsPatientOrAdmin(BasePermission):
    """
    Grants access to PATIENT or ADMIN roles.
    """
    message = 'Access restricted to patients or admins.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('PATIENT', 'ADMIN')
        )


class IsDoctorOrAdmin(BasePermission):
    """
    Grants access to DOCTOR or ADMIN roles.
    """
    message = 'Access restricted to doctors or admins.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('DOCTOR', 'ADMIN')
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission: allows access only if the user owns the object
    or is an admin.

    The view's object must have an attribute matching the user field.
    Defaults to checking obj.user == request.user.
    """
    message = 'You do not have permission to access this resource.'

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True

        # Support objects where the owner field is 'user', 'patient', etc.
        owner_fields = ['user', 'patient', 'owner']
        for field in owner_fields:
            if hasattr(obj, field):
                return getattr(obj, field) == request.user

        return False
