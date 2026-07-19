from django.urls import path
from .views import PatientProfileView, HealthMetricListView, AvailableMetricsView

app_name = 'patients'

urlpatterns = [
    path('profile/', PatientProfileView.as_view(), name='patient-profile'),
    path('metrics/', HealthMetricListView.as_view(), name='health-metrics'),
    path('metrics/available/', AvailableMetricsView.as_view(), name='available-metrics'),
]
