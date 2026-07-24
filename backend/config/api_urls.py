from django.urls import path, include
from apps.core.views import HealthCheckAPIView

app_name = 'api_v1'

urlpatterns = [
    # ─── Foundation ────────────────────────────────────────────────────────
    path('health/', HealthCheckAPIView.as_view(), name='health-check'),

    # ─── Feature Modules ───────────────────────────────────────────────────
    path('auth/',            include('apps.accounts.urls',        namespace='auth')),
    path('patients/',        include('apps.patients.urls',        namespace='patients')),
    path('doctors/',         include('apps.doctors.urls',         namespace='doctors')),
    path('records/',         include('apps.medical_records.urls', namespace='medical_records')),
    path('appointments/',    include('apps.appointments.urls',    namespace='appointments')),
    path('timeline/',        include('apps.timeline.urls',        namespace='timeline')),
    path('notifications/',   include('apps.notifications.urls',   namespace='notifications')),
    path('ai/',              include('apps.ai.urls',              namespace='ai')),
    path('ml/',              include('apps.ml.urls',              namespace='ml')),
]