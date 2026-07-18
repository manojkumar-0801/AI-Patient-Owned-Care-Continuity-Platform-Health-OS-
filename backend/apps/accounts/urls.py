"""
URL routes for the Authentication module.

All routes are prefixed with /api/v1/auth/ (defined in config/urls.py).
"""
from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    TokenRefreshView,
    MeView,
    ChangePasswordView,
    PatientOnlyView,
    DoctorOnlyView,
    AdminOnlyView,
)

app_name = 'auth'

urlpatterns = [
    # ── Core Auth ────────────────────────────────────────────────────────────
    path('register/',         RegisterView.as_view(),      name='register'),
    path('login/',            LoginView.as_view(),          name='login'),
    path('logout/',           LogoutView.as_view(),         name='logout'),
    path('token/refresh/',    TokenRefreshView.as_view(),   name='token-refresh'),

    # ── Profile ──────────────────────────────────────────────────────────────
    path('me/',               MeView.as_view(),             name='me'),
    path('change-password/',  ChangePasswordView.as_view(), name='change-password'),

    # ── Role-Protected Demo Endpoints ────────────────────────────────────────
    path('patient-only/',     PatientOnlyView.as_view(),    name='patient-only'),
    path('doctor-only/',      DoctorOnlyView.as_view(),     name='doctor-only'),
    path('admin-only/',       AdminOnlyView.as_view(),      name='admin-only'),
]
