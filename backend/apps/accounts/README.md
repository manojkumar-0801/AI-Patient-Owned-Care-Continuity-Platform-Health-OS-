# 🔐 accounts — Authentication App

Custom authentication module for Health OS.

---

## What's Inside

| File | Purpose |
|---|---|
| `models.py` | `User` (UUID PK, email auth, role) + `UserProfile` |
| `managers.py` | `UserManager` — `create_user` / `create_superuser` with email |
| `serializers.py` | Register, Login (JWT), Profile, Password change |
| `views.py` | Register, Login, Logout, Refresh, Me, RBAC demos |
| `urls.py` | All `/api/v1/auth/` routes |
| `permissions.py` | `IsPatient`, `IsDoctor`, `IsAdmin`, `IsOwnerOrAdmin` |
| `exceptions.py` | Custom DRF error handler → consistent JSON envelope |
| `signals.py` | Logs new user creation |
| `admin.py` | Django Admin with inline profile |
| `migrations/` | Database schema history |
| `tests/` | Full test suite |

---

## Models

### `User`
```
id            UUID (PK, auto)
email         EmailField (unique, login field)
phone         CharField (unique, optional)
role          PATIENT | DOCTOR | ADMIN
is_active     Bool
is_verified   Bool
mfa_enabled   Bool
created_at    DateTimeField
deleted_at    DateTimeField (soft delete)
```

### `UserProfile` (1:1 with User)
```
first_name / last_name
date_of_birth / gender
blood_type
allergies           JSONField (list)
chronic_conditions  JSONField (list)
current_medications JSONField (list)
emergency_name / emergency_phone / emergency_relation
profile_photo_url
```

---

## Custom Permissions

```python
from apps.accounts.permissions import IsPatient, IsDoctor, IsAdmin, IsOwnerOrAdmin

class MyView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]
```

---

## Tests

```bash
python manage.py test apps.accounts.tests.test_register
python manage.py test apps.accounts.tests.test_auth
python manage.py test apps.accounts.tests.test_permissions
```

---

## Migrations

```bash
# Apply existing migrations
python manage.py migrate accounts

# Create new migration after model changes
python manage.py makemigrations accounts
```
