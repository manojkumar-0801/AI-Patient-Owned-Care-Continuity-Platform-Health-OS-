"""
Tests for Role-Based Access Control (RBAC) endpoints.

Coverage:
    - PATIENT can access patient-only endpoint
    - DOCTOR cannot access patient-only endpoint (403)
    - DOCTOR can access doctor-only endpoint
    - PATIENT cannot access doctor-only endpoint (403)
    - ADMIN can access admin-only endpoint
    - Non-admins cannot access admin-only endpoint (403)
    - Unauthenticated requests are rejected (401)
"""
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

PATIENT_URL = reverse('auth:patient-only')
DOCTOR_URL  = reverse('auth:doctor-only')
ADMIN_URL   = reverse('auth:admin-only')


def create_user_with_token(role):
    """Create a user and return (user, access_token)."""
    email = f'{role.lower()}@example.com'
    user  = User.objects.create_user(email=email, password='TestPass@123', role=role)
    token = str(RefreshToken.for_user(user).access_token)
    return user, token


class RBACTests(APITestCase):
    """Test suite for role-based access control."""

    def setUp(self):
        self.patient, self.patient_token = create_user_with_token('PATIENT')
        self.doctor,  self.doctor_token  = create_user_with_token('DOCTOR')
        self.admin,   self.admin_token   = create_user_with_token('ADMIN')

    def _auth(self, token):
        """Helper to set Authorization header."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # ── Patient-Only ─────────────────────────────────────────────────────────

    def test_patient_can_access_patient_endpoint(self):
        self._auth(self.patient_token)
        response = self.client.get(PATIENT_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_doctor_cannot_access_patient_endpoint(self):
        self._auth(self.doctor_token)
        response = self.client.get(PATIENT_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_cannot_access_patient_endpoint(self):
        self._auth(self.admin_token)
        response = self.client.get(PATIENT_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Doctor-Only ──────────────────────────────────────────────────────────

    def test_doctor_can_access_doctor_endpoint(self):
        self._auth(self.doctor_token)
        response = self.client.get(DOCTOR_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patient_cannot_access_doctor_endpoint(self):
        self._auth(self.patient_token)
        response = self.client.get(DOCTOR_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Admin-Only ───────────────────────────────────────────────────────────

    def test_admin_can_access_admin_endpoint(self):
        self._auth(self.admin_token)
        response = self.client.get(ADMIN_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', response.data['data'])

    def test_patient_cannot_access_admin_endpoint(self):
        self._auth(self.patient_token)
        response = self.client.get(ADMIN_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_doctor_cannot_access_admin_endpoint(self):
        self._auth(self.doctor_token)
        response = self.client.get(ADMIN_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ── Unauthenticated ──────────────────────────────────────────────────────

    def test_unauthenticated_patient_endpoint(self):
        response = self.client.get(PATIENT_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_doctor_endpoint(self):
        response = self.client.get(DOCTOR_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_admin_endpoint(self):
        response = self.client.get(ADMIN_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
