from django.contrib import admin
from .models import MedicalDocument, ShareToken, AccessLog


@admin.register(MedicalDocument)
class MedicalDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'category', 'upload_status', 'created_at', 'deleted_at')
    search_fields = ('title', 'patient__email', 'provider_name')
    list_filter = ('category', 'upload_status', 'file_type')
    date_hierarchy = 'created_at'
    list_select_related = ('patient',)
    readonly_fields = ('id', 'file_size_bytes', 'created_at', 'updated_at')


@admin.register(ShareToken)
class ShareTokenAdmin(admin.ModelAdmin):
    list_display = ('token', 'patient', 'scope', 'expiry_at', 'is_revoked', 'access_count')
    search_fields = ('token', 'patient__email')
    list_filter = ('scope', 'is_revoked')
    date_hierarchy = 'created_at'
    readonly_fields = ('id', 'token', 'access_count', 'created_at')


@admin.register(AccessLog)
class AccessLogAdmin(admin.ModelAdmin):
    list_display = ('token', 'accessor_ip', 'accessed_at')
    search_fields = ('token__token', 'accessor_ip')
    date_hierarchy = 'accessed_at'
    readonly_fields = ('id', 'token', 'accessor_ip', 'accessor_ua', 'documents_viewed', 'accessed_at')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
