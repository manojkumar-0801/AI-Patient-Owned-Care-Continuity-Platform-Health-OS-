"""
Custom exception handler for Health OS API.

Wraps all DRF exceptions in a consistent response envelope:
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Human readable message",
        "details": { ... }
    }
}
"""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that wraps DRF responses in a standard envelope.
    """
    # Get the standard DRF response first
    response = exception_handler(exc, context)

    if response is not None:
        error_code = _get_error_code(response.status_code, response.data)
        message    = _get_human_message(response.status_code, response.data)
        details    = _get_details(response.data)

        response.data = {
            'success': False,
            'error': {
                'code':    error_code,
                'message': message,
                'details': details,
            }
        }
    else:
        # Unhandled server error
        logger.exception('Unhandled exception: %s', exc)
        response = Response(
            {
                'success': False,
                'error': {
                    'code':    'INTERNAL_ERROR',
                    'message': 'An unexpected error occurred. Please try again later.',
                    'details': {},
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response


def _get_error_code(status_code, data):
    """Map status codes and DRF error detail codes to our error codes."""
    code_map = {
        400: 'VALIDATION_ERROR',
        401: 'UNAUTHORIZED',
        403: 'PERMISSION_DENIED',
        404: 'NOT_FOUND',
        405: 'METHOD_NOT_ALLOWED',
        409: 'CONFLICT',
        429: 'RATE_LIMIT_EXCEEDED',
        500: 'INTERNAL_ERROR',
    }

    # Check if DRF provides a specific code
    if isinstance(data, dict) and 'detail' in data:
        detail = data['detail']
        if hasattr(detail, 'code'):
            code_overrides = {
                'token_not_valid':      'TOKEN_INVALID',
                'token_not_provided':   'TOKEN_REQUIRED',
                'authentication_failed': 'INVALID_CREDENTIALS',
                'not_authenticated':    'UNAUTHORIZED',
                'permission_denied':    'PERMISSION_DENIED',
                'not_found':            'NOT_FOUND',
                'throttled':            'RATE_LIMIT_EXCEEDED',
            }
            if detail.code in code_overrides:
                return code_overrides[detail.code]

    return code_map.get(status_code, 'ERROR')


def _get_human_message(status_code, data):
    """Return a user-friendly error message."""
    if isinstance(data, dict) and 'detail' in data:
        return str(data['detail'])

    messages = {
        400: 'The request could not be processed due to invalid input.',
        401: 'Authentication is required to access this resource.',
        403: 'You do not have permission to perform this action.',
        404: 'The requested resource was not found.',
        429: 'Too many requests. Please slow down and try again.',
        500: 'An unexpected server error occurred.',
    }
    return messages.get(status_code, 'An error occurred.')


def _get_details(data):
    """Extract field-level validation errors for 400 responses."""
    if isinstance(data, dict) and 'detail' not in data:
        # Field-level errors from serializer validation
        return {field: errors for field, errors in data.items()}
    return {}
