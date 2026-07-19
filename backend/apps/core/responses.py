"""
Standardized API Responses.
"""
from rest_framework.response import Response
from rest_framework import status

class SuccessResponse(Response):
    """
    A standard success response.
    Format:
    {
        "success": true,
        "data": { ... },
        "message": "Optional message"
    }
    """
    def __init__(self, data=None, message=None, status_code=status.HTTP_200_OK, **kwargs):
        payload = {
            "success": True,
            "data": data if data is not None else {}
        }
        if message:
            payload["message"] = message
        
        super().__init__(data=payload, status=status_code, **kwargs)

class ErrorResponse(Response):
    """
    A standard error response.
    Mostly handled globally by custom_exception_handler, but can be used directly.
    """
    def __init__(self, message="An error occurred", code="ERROR", details=None, status_code=status.HTTP_400_BAD_REQUEST, **kwargs):
        payload = {
            "success": False,
            "error": {
                "code": code,
                "message": message,
                "details": details or {}
            }
        }
        super().__init__(data=payload, status=status_code, **kwargs)
