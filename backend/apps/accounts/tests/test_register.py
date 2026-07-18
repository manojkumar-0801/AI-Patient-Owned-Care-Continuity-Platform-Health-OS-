"""
Tests for user registration endpoint.

Coverage:
    - Successful registration (Patient & Doctor)
    - Duplicate email rejection
    - Weak password rejection
    - Password mismatch rejection
    - Missing required fields
    - JWT tokens issued on registration
"""
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

from apps.authentication.models import UserProfile

User = get_user_model()
REGISTER_URL = reverse('auth:register')


class RegisterViewTests(APITestCase):
    """Test suite for POST /api/v1/auth/register/"""

    def setUp(self):
        self.valid_payload = {
            'first_name':       'Priya',
            'last_name':        'Sharma',
            'email':            'priya@example.com',
            'phone':            '+919876543210',
            'password':         'StrongPass@123',
            'confirm_password': 'StrongPass@123',
            'role':             'PATIENT',
        }

    # ── Success Cases ─────────────────────────────────────────────────────────

    def test_register_patient_success(self):
        """A patient can register with valid data."""
        response = self.client.post(REGISTER_URL, self.valid_payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('access_token', response.data['data'])
        self.assertIn('refresh_token', response.data['data'])
        self.assertEqual(response.data['data']['user']['role'], 'PATIENT')

    def test_register_doctor_success(self):
        """A doctor can register with valid data."""
        payload = {**self.valid_payload, 'role': 'DOCTOR', 'email': 'doctor@example.com'}
        response = self.client.post(REGISTER_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['user']['role'], 'DOCTOR')

    def test_user_profile_created_on_register(self):
        """UserProfile is automatically created on registration."""
        self.client.post(REGISTER_URL, self.valid_payload)

        user = User.objects.get(email='priya@example.com')
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        profile = user.profile
        self.assertEqual(profile.first_name, 'Priya')
        self.assertEqual(profile.last_name, 'Sharma')

    def test_user_is_active_immediately(self):
        """User account is active immediately (no email verification in MVP)."""
        self.client.post(REGISTER_URL, self.valid_payload)
        user = User.objects.get(email='priya@example.com')
        self.assertTrue(user.is_active)

    # ── Failure Cases ─────────────────────────────────────────────────────────

    def test_duplicate_email_rejected(self):
        """Registration fails if email is already in use."""
        self.client.post(REGISTER_URL, self.valid_payload)
        response = self.client.post(REGISTER_URL, self.valid_payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error']['code'], 'VALIDATION_ERROR')

    def test_password_mismatch_rejected(self):
        """Registration fails if passwords do not match."""
        payload = {**self.valid_payload, 'confirm_password': 'WrongPassword!'}
        response = self.client.post(REGISTER_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data['error']['details'])

    def test_weak_password_rejected(self):
        """Registration fails if password is too weak."""
        payload = {**self.valid_payload, 'password': '123', 'confirm_password': '123'}
        response = self.client.post(REGISTER_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_email_rejected(self):
        """Registration fails if email is missing."""
        payload = {**self.valid_payload}
        del payload['email']
        response = self.client.post(REGISTER_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_email_format_rejected(self):
        """Registration fails for invalid email format."""
        payload = {**self.valid_payload, 'email': 'not-an-email'}
        response = self.client.post(REGISTER_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_phone_rejected(self):
        """Registration fails for invalid phone number format."""
        payload = {**self.valid_payload, 'phone': '123'}
        response = self.client.post(REGISTER_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
