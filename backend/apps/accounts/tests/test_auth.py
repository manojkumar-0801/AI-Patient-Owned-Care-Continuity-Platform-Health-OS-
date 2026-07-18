"""
Tests for login, logout, and JWT token refresh endpoints.

Coverage:
    - Successful login returns tokens + user info
    - Invalid credentials rejected
    - Logout blacklists refresh token
    - Token refresh works with valid refresh token
    - Expired/invalid refresh token rejected
    - Access to protected endpoint requires valid JWT
"""
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

LOGIN_URL   = reverse('auth:login')
LOGOUT_URL  = reverse('auth:logout')
REFRESH_URL = reverse('auth:token-refresh')
ME_URL      = reverse('auth:me')


def create_user(**kwargs):
    """Helper to create a test user."""
    defaults = {
        'email':    'test@example.com',
        'password': 'TestPass@123',
        'role':     'PATIENT',
    }
    defaults.update(kwargs)
    return User.objects.create_user(**defaults)


class LoginViewTests(APITestCase):
    """Test suite for POST /api/v1/auth/login/"""

    def setUp(self):
        self.user = create_user()

    def test_login_success(self):
        """Valid credentials return access + refresh tokens and user info."""
        response = self.client.post(LOGIN_URL, {
            'email':    'test@example.com',
            'password': 'TestPass@123',
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        data = response.data['data']
        self.assertIn('access_token', data)
        self.assertIn('refresh_token', data)
        self.assertEqual(data['user']['email'], 'test@example.com')
        self.assertEqual(data['user']['role'], 'PATIENT')

    def test_login_invalid_password(self):
        """Wrong password returns 401 INVALID_CREDENTIALS."""
        response = self.client.post(LOGIN_URL, {
            'email':    'test@example.com',
            'password': 'WrongPassword!',
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error']['code'], 'INVALID_CREDENTIALS')

    def test_login_nonexistent_email(self):
        """Non-existent email returns 401."""
        response = self.client.post(LOGIN_URL, {
            'email':    'nobody@example.com',
            'password': 'TestPass@123',
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_inactive_user_rejected(self):
        """Inactive user cannot login."""
        self.user.is_active = False
        self.user.save()

        response = self.client.post(LOGIN_URL, {
            'email':    'test@example.com',
            'password': 'TestPass@123',
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutViewTests(APITestCase):
    """Test suite for POST /api/v1/auth/logout/"""

    def setUp(self):
        self.user = create_user()
        login_resp = self.client.post(LOGIN_URL, {
            'email':    'test@example.com',
            'password': 'TestPass@123',
        })
        self.access_token  = login_resp.data['data']['access_token']
        self.refresh_token = login_resp.data['data']['refresh_token']

    def test_logout_success(self):
        """Logout blacklists the refresh token."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(LOGOUT_URL, {'refresh_token': self.refresh_token})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_blacklisted_refresh_cannot_be_reused(self):
        """After logout, the same refresh token cannot generate a new access token."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        self.client.post(LOGOUT_URL, {'refresh_token': self.refresh_token})

        # Try to refresh with the now-blacklisted token
        response = self.client.post(REFRESH_URL, {'refresh': self.refresh_token})
        self.assertIn(response.status_code, [
            status.HTTP_401_UNAUTHORIZED, status.HTTP_400_BAD_REQUEST
        ])

    def test_logout_requires_authentication(self):
        """Logout endpoint requires a valid access token."""
        response = self.client.post(LOGOUT_URL, {'refresh_token': self.refresh_token})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenRefreshViewTests(APITestCase):
    """Test suite for POST /api/v1/auth/token/refresh/"""

    def setUp(self):
        self.user = create_user()
        login_resp = self.client.post(LOGIN_URL, {
            'email':    'test@example.com',
            'password': 'TestPass@123',
        })
        self.refresh_token = login_resp.data['data']['refresh_token']

    def test_refresh_success(self):
        """Valid refresh token returns a new access token."""
        response = self.client.post(REFRESH_URL, {'refresh': self.refresh_token})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access_token', response.data['data'])

    def test_invalid_refresh_token_rejected(self):
        """Invalid refresh token returns 401."""
        response = self.client.post(REFRESH_URL, {'refresh': 'totally.invalid.token'})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_with_valid_token(self):
        """A valid access token grants access to protected /me/ endpoint."""
        login_resp = self.client.post(LOGIN_URL, {
            'email':    'test@example.com',
            'password': 'TestPass@123',
        })
        access_token = login_resp.data['data']['access_token']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(ME_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['email'], 'test@example.com')

    def test_protected_endpoint_without_token_rejected(self):
        """No token returns 401 on protected endpoint."""
        response = self.client.get(ME_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_with_invalid_token_rejected(self):
        """Invalid token returns 401 on protected endpoint."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid.jwt.token')
        response = self.client.get(ME_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
