# 🔧 Backend — Health OS API

Django REST Framework backend for the Health OS platform.

---

## Structure

```
backend/
├── apps/
│   └── accounts/           # Authentication app
│       ├── migrations/     # DB schema migrations
│       │   ├── __init__.py
│       │   └── 0001_initial.py
│       ├── tests/          # Test suites
│       │   ├── test_register.py
│       │   ├── test_auth.py
│       │   └── test_permissions.py
│       ├── models.py       # User + UserProfile
│       ├── serializers.py  # Input/output validation
│       ├── views.py        # API endpoint logic
│       ├── urls.py         # Route definitions
│       ├── permissions.py  # RBAC classes
│       ├── exceptions.py   # Custom error handler
│       ├── managers.py     # UserManager (email auth)
│       └── signals.py      # Post-save signals
│
├── config/
│   ├── settings/
│   │   ├── base.py         # JWT, DRF, CORS config
│   │   ├── development.py  # Local dev overrides
│   │   └── production.py   # Production hardening
│   ├── urls.py             # Root URL router
│   ├── wsgi.py
│   └── asgi.py
│
├── requirements/
│   ├── base.txt            # Django, DRF, JWT, psycopg2
│   ├── development.txt     # pytest, debug-toolbar
│   └── production.txt      # gunicorn
│
├── manage.py
├── create_db.py            # DB creation helper script
├── .env                    # Local secrets (not in git)
└── .env.example            # Template for .env
```

---

## Setup

```bash
# 1. Create & activate venv
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements/development.txt

# 3. Copy and configure .env
cp .env.example .env

# 4. Create PostgreSQL database
python create_db.py

# 5. Run migrations
python manage.py migrate

# 6. Create admin user
python manage.py createsuperuser

# 7. Start server
python manage.py runserver
```

---

## API Endpoints

| Method | URL | Auth | Role |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | Public | Any |
| POST | `/api/v1/auth/login/` | Public | Any |
| POST | `/api/v1/auth/logout/` | JWT | Any |
| POST | `/api/v1/auth/token/refresh/` | Public | Any |
| GET/PATCH | `/api/v1/auth/me/` | JWT | Any |
| POST | `/api/v1/auth/change-password/` | JWT | Any |
| GET | `/api/v1/auth/patient-only/` | JWT | PATIENT |
| GET | `/api/v1/auth/doctor-only/` | JWT | DOCTOR |
| GET | `/api/v1/auth/admin-only/` | JWT | ADMIN |

---

## Running Tests

```bash
python manage.py test apps.accounts
```

---

## API Docs

- Swagger: http://localhost:8000/api/docs/
- ReDoc:   http://localhost:8000/api/redoc/
- Admin:   http://localhost:8000/admin/
