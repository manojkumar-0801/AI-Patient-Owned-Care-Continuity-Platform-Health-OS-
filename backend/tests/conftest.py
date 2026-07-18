"""
Pytest configuration and shared fixtures for integration tests.
"""
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def patient_user(db):
    return User.objects.create_user(
        email='patient@test.com',
        password='TestPass@123',
        role='PATIENT'
    )


@pytest.fixture
def doctor_user(db):
    return User.objects.create_user(
        email='doctor@test.com',
        password='TestPass@123',
        role='DOCTOR'
    )


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email='admin@test.com',
        password='TestPass@123',
        role='ADMIN'
    )
