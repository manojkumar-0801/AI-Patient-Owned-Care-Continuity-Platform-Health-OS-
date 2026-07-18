"""
Authentication Views for Health OS.

Endpoints:
    POST   /api/v1/auth/register/          → RegisterView
    POST   /api/v1/auth/login/             → LoginView
    POST   /api/v1/auth/logout/            → LogoutView
    POST   /api/v1/auth/token/refresh/     → TokenRefreshView
    GET    /api/v1/auth/me/                → MeView
    PATCH  /api/v1/auth/me/                → MeView
    POST   /api/v1/auth/change-password/   → ChangePasswordView

    # Role-demo endpoints
    GET    /api/v1/auth/patient-only/      → PatientOnlyView
    GET    /api/v1/auth/doctor-only/       → DoctorOnlyView
    GET    /api/v1/auth/admin-only/        → AdminOnlyView
"""
import logging
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView as BaseTokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UpdateMeSerializer,
    ChangePasswordSerializer,
    LogoutSerializer,
)
from .permissions import IsPatient, IsDoctor, IsAdmin

logger = logging.getLogger(__name__)
User = get_user_model()


# ─── Response Helpers ─────────────────────────────────────────────────────────
def success_response(data=None, message='Success', status_code=status.HTTP_200_OK):
    return Response({'success': True, 'data': data, 'message': message}, status=status_code)


def error_response(message, code='ERROR', details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response(
        {'success': False, 'error': {'code': code, 'message': message, 'details': details or {}}},
        status=status_code
    )


# ─── Auth Throttle ────────────────────────────────────────────────────────────
class AuthRateThrottle(AnonRateThrottle):
    """Strict throttle for auth endpoints (10/min per IP)."""
    scope = 'auth'


# ─── Register ────────────────────────────────────────────────────────────────
class RegisterView(APIView):
    """
    POST /api/v1/auth/register/

    Register a new user (Patient or Doctor).
    Creates User + UserProfile in a single transaction.
    User is active immediately (email verification skipped in MVP).
    """
    permission_classes = [AllowAny]
    throttle_classes   = [AuthRateThrottle]

    @extend_schema(
        request=RegisterSerializer,
        responses={201: OpenApiResponse(description='User registered successfully')},
        tags=['Authentication'],
        summary='Register a new user',
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message='Registration failed. Please check the fields below.',
                code='VALIDATION_ERROR',
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()

        # Issue JWT tokens immediately upon registration
        refresh = RefreshToken.for_user(user)
        access  = refresh.access_token

        return success_response(
            data={
                'user': {
                    'id':    str(user.id),
                    'email': user.email,
                    'role':  user.role,
                },
                'access_token':  str(access),
                'refresh_token': str(refresh),
                'token_type':    'Bearer',
                'expires_in':    int(access.lifetime.total_seconds()),
            },
            message='Account created successfully. Welcome to Health OS!',
            status_code=status.HTTP_201_CREATED,
        )


# ─── Login ────────────────────────────────────────────────────────────────────
class LoginView(TokenObtainPairView):
    """
    POST /api/v1/auth/login/

    Authenticate with email + password.
    Returns access token (15 min) + refresh token (7 days) + user info.
    """
    serializer_class   = CustomTokenObtainPairSerializer
    throttle_classes   = [AuthRateThrottle]
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Authentication'],
        summary='Login with email and password',
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            return error_response(
                message='Invalid credentials.',
                code='INVALID_CREDENTIALS',
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            # Handle deactivated account or invalid credentials
            if hasattr(e, 'detail'):
                return error_response(
                    message=str(e.detail.get('detail', 'Invalid email or password.')),
                    code='INVALID_CREDENTIALS',
                    status_code=status.HTTP_401_UNAUTHORIZED,
                )
            raise

        data = serializer.validated_data
        logger.info('User logged in: %s', data.get('user', {}).get('email', ''))

        return success_response(
            data={
                'access_token':  data['access'],
                'refresh_token': data['refresh'],
                'token_type':    data['token_type'],
                'user':          data['user'],
            },
            message='Login successful.',
        )


# ─── Logout ───────────────────────────────────────────────────────────────────
class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/

    Blacklist the refresh token to invalidate the session.
    Requires: Authorization: Bearer <access_token>
    Body: { "refresh_token": "..." }
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=LogoutSerializer,
        tags=['Authentication'],
        summary='Logout and invalidate refresh token',
    )
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message='Invalid refresh token.',
                code='VALIDATION_ERROR',
                details=serializer.errors,
            )

        try:
            token = RefreshToken(serializer.validated_data['refresh_token'])
            token.blacklist()
            logger.info('User logged out: %s', request.user.email)
        except TokenError:
            return error_response(
                message='Token is already blacklisted or invalid.',
                code='TOKEN_INVALID',
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return success_response(message='Logged out successfully.')


# ─── Token Refresh ────────────────────────────────────────────────────────────
class TokenRefreshView(BaseTokenRefreshView):
    """
    POST /api/v1/auth/token/refresh/

    Exchange a valid refresh token for a new access token.
    Old refresh token is blacklisted (ROTATE_REFRESH_TOKENS=True).
    """
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Authentication'],
        summary='Refresh access token using refresh token',
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except (TokenError, InvalidToken):
            return error_response(
                message='Refresh token is invalid or has expired. Please login again.',
                code='TOKEN_EXPIRED',
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        data = serializer.validated_data
        return success_response(
            data={
                'access_token':  data['access'],
                'refresh_token': data.get('refresh', ''),
                'token_type':    'Bearer',
            },
            message='Token refreshed successfully.',
        )


# ─── Me (Profile) ─────────────────────────────────────────────────────────────
class MeView(APIView):
    """
    GET  /api/v1/auth/me/  → Return current user's profile
    PATCH /api/v1/auth/me/ → Update profile fields
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: UserSerializer},
        tags=['User Profile'],
        summary='Get current user profile',
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return success_response(data=serializer.data)

    @extend_schema(
        request=UpdateMeSerializer,
        tags=['User Profile'],
        summary='Update current user profile',
    )
    def patch(self, request):
        serializer = UpdateMeSerializer(data=request.data, partial=True)

        if not serializer.is_valid():
            return error_response(
                message='Profile update failed.',
                code='VALIDATION_ERROR',
                details=serializer.errors,
            )

        serializer.update(request.user, serializer.validated_data)
        updated_user = UserSerializer(request.user)
        return success_response(data=updated_user.data, message='Profile updated successfully.')


# ─── Change Password ──────────────────────────────────────────────────────────
class ChangePasswordView(APIView):
    """
    POST /api/v1/auth/change-password/

    Change password for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ChangePasswordSerializer,
        tags=['Authentication'],
        summary='Change password for authenticated user',
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message='Password change failed.',
                code='VALIDATION_ERROR',
                details=serializer.errors,
            )

        user = request.user
        if not user.check_password(serializer.validated_data['current_password']):
            return error_response(
                message='Your current password is incorrect.',
                code='INVALID_PASSWORD',
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])
        logger.info('Password changed for user: %s', user.email)

        return success_response(message='Password changed successfully. Please login again.')


# ─── Role-Protected Demo Endpoints ───────────────────────────────────────────
class PatientOnlyView(APIView):
    """
    GET /api/v1/auth/patient-only/

    Example of a PATIENT-role-protected endpoint.
    Returns 403 for DOCTOR or ADMIN roles.
    """
    permission_classes = [IsAuthenticated, IsPatient]

    @extend_schema(tags=['Role Demo'], summary='Patient-only protected endpoint')
    def get(self, request):
        return success_response(
            data={
                'message': f'Hello, {request.user.full_name}! This is your patient dashboard.',
                'role':    request.user.role,
                'user_id': str(request.user.id),
            }
        )


class DoctorOnlyView(APIView):
    """
    GET /api/v1/auth/doctor-only/

    Example of a DOCTOR-role-protected endpoint.
    Returns 403 for PATIENT or ADMIN roles.
    """
    permission_classes = [IsAuthenticated, IsDoctor]

    @extend_schema(tags=['Role Demo'], summary='Doctor-only protected endpoint')
    def get(self, request):
        return success_response(
            data={
                'message': f'Hello Dr. {request.user.full_name}! This is the doctor portal.',
                'role':    request.user.role,
                'user_id': str(request.user.id),
            }
        )


class AdminOnlyView(APIView):
    """
    GET /api/v1/auth/admin-only/

    Example of an ADMIN-role-protected endpoint.
    Returns 403 for PATIENT or DOCTOR roles.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(tags=['Role Demo'], summary='Admin-only protected endpoint')
    def get(self, request):
        return success_response(
            data={
                'message':    'Admin panel access granted.',
                'role':       request.user.role,
                'user_id':    str(request.user.id),
                'total_users': User.objects.count(),
            }
        )
