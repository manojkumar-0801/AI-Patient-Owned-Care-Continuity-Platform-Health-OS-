from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalDocumentViewSet, ShareTokenViewSet, PublicShareAccessView

app_name = 'medical_records'

router = DefaultRouter()
router.register(r'documents', MedicalDocumentViewSet, basename='document')
router.register(r'share', ShareTokenViewSet, basename='share')
router.register(r'public-share', PublicShareAccessView, basename='public-share')

urlpatterns = [
    path('', include(router.urls)),
]
