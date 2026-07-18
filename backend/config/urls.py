"""
Root URL Configuration for Health OS.
All API routes are versioned under /api/v1/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # ─── Django Admin ────────────────────────────────────────────────────────
    path('admin/', admin.site.urls),

    # ─── API v1 ──────────────────────────────────────────────────────────────
    path('api/v1/auth/',            include('apps.accounts.urls',        namespace='auth')),
    path('api/v1/patients/',        include('apps.patients.urls',        namespace='patients')),
    path('api/v1/doctors/',         include('apps.doctors.urls',         namespace='doctors')),
    path('api/v1/records/',         include('apps.medical_records.urls', namespace='medical_records')),
    path('api/v1/appointments/',    include('apps.appointments.urls',    namespace='appointments')),
    path('api/v1/timeline/',        include('apps.timeline.urls',        namespace='timeline')),
    path('api/v1/notifications/',   include('apps.notifications.urls',   namespace='notifications')),
    path('api/v1/ai/',              include('apps.ai.urls',              namespace='ai')),
    path('api/v1/ml/',              include('apps.ml.urls',              namespace='ml')),

    # ─── API Schema & Docs ───────────────────────────────────────────────────
    path('api/schema/', SpectacularAPIView.as_view(),                          name='schema'),
    path('api/docs/',   SpectacularSwaggerView.as_view(url_name='schema'),     name='swagger-ui'),
    path('api/redoc/',  SpectacularRedocView.as_view(url_name='schema'),       name='redoc'),
]

# ─── Serve media files in development ────────────────────────────────────────
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
