<div align="center">

# 🏥 Health OS
### AI Patient-Owned Care Continuity Platform

[![Python](https://img.shields.io/badge/Python-3.14-blue?logo=python)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2-green?logo=django)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/DRF-3.15-red)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)](https://postgresql.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)

> **Empower every patient to own, understand, and share their complete health story — anywhere, anytime.**

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Authentication Flow](#-authentication-flow)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)

---

## 🌟 Overview

Health OS is a **patient-centric healthcare platform** where individuals own and govern their entire medical history. The platform breaks down healthcare data silos by serving as a single source of truth for health records, enhanced by:

- 🤖 **AI-powered report summarization** — LLM explains medical reports in plain language
- 🔍 **OCR document ingestion** — Auto-extracts data from PDFs and medical images
- 📈 **Health trend analysis** — Visualizes vitals and lab values over time
- 🔐 **Consent-based sharing** — Patients share records securely with doctors via time-limited tokens

---

## ✨ Key Features

| Feature | Status |
|---|---|
| 🔐 JWT Authentication (Register / Login / Logout) | ✅ Done |
| 👤 Role-Based Access Control (Patient / Doctor / Admin) | ✅ Done |
| 🏥 Health Vault (Document Upload & Management) | 🔄 In Progress |
| 🤖 AI Report Summarization (GPT-4 / Gemini) | 📋 Planned |
| 🔬 OCR Document Processing | 📋 Planned |
| 📊 Health Trend Charts | 📋 Planned |
| 🔗 Secure Doctor Sharing (Token + QR) | 📋 Planned |
| 🚨 Emergency Health Card | 📋 Planned |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Django 4.2 + Django REST Framework 3.15 |
| **Auth** | JWT (djangorestframework-simplejwt) + RBAC |
| **Database** | PostgreSQL 17 |
| **Frontend** | React 18 + TypeScript *(Phase 2)* |
| **AI/ML** | OpenAI GPT-4o / Google Gemini *(Phase 2)* |
| **Async Tasks** | Celery + Redis |
| **API Docs** | drf-spectacular (Swagger / ReDoc) |
| **Testing** | pytest + pytest-django |

---

## 📁 Project Structure

```
AI-Patient-Health-OS/
│
├── 📂 backend/                     # Django REST API
│   ├── 📂 apps/
│   │   └── 📂 accounts/            # Auth: User model, JWT, RBAC
│   │       ├── migrations/         # Database migrations
│   │       │   ├── __init__.py
│   │       │   └── 0001_initial.py
│   │       ├── tests/              # Unit & integration tests
│   │       ├── models.py           # User + UserProfile models
│   │       ├── serializers.py      # Request/response validation
│   │       ├── views.py            # API views (Register, Login, etc.)
│   │       ├── urls.py             # Auth URL routes
│   │       ├── permissions.py      # RBAC permission classes
│   │       ├── exceptions.py       # Custom error handler
│   │       ├── managers.py         # Custom UserManager
│   │       └── signals.py          # Django signals
│   │
│   ├── 📂 config/
│   │   ├── settings/
│   │   │   ├── base.py            # Shared settings (JWT, DRF, CORS)
│   │   │   ├── development.py     # Dev settings
│   │   │   └── production.py      # Prod settings (SSL, SMTP)
│   │   ├── urls.py                # Root URL config
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── 📂 requirements/
│   │   ├── base.txt               # Core dependencies
│   │   ├── development.txt        # Dev tools
│   │   └── production.txt         # Prod server (gunicorn)
│   │
│   ├── manage.py
│   ├── .env                       # Local environment (not in git)
│   ├── .env.example               # Environment template
│   └── .gitignore
│
├── 📂 docs/                        # Project documentation
│   ├── 01_product_vision.md
│   ├── 02_requirements_analysis.md
│   ├── 03_system_architecture.md
│   ├── 04_database_design.md
│   └── 05_api_design.md
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.14+
- PostgreSQL 17
- Git

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/AI-Patient-Health-OS.git
cd AI-Patient-Health-OS/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements/development.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and secret key
```

### 3. Database Setup

```bash
# Create the database
python create_db.py

# Run Django migrations
python manage.py migrate
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

### 5. Run the Server

```bash
python manage.py runserver
```

API is live at → `http://localhost:8000`

---

## 📚 API Documentation

| Interface | URL |
|---|---|
| **Swagger UI** | http://localhost:8000/api/docs/ |
| **ReDoc** | http://localhost:8000/api/redoc/ |
| **Django Admin** | http://localhost:8000/admin/ |

---

## 🔐 Authentication Flow

```
POST  /api/v1/auth/register/        → Register + receive JWT tokens
POST  /api/v1/auth/login/           → Login + receive JWT tokens
POST  /api/v1/auth/logout/          → Blacklist refresh token
POST  /api/v1/auth/token/refresh/   → Refresh access token (silent)
GET   /api/v1/auth/me/              → Get current user profile
PATCH /api/v1/auth/me/              → Update profile
POST  /api/v1/auth/change-password/ → Change password

# Role-Protected Demo Endpoints
GET   /api/v1/auth/patient-only/    → PATIENT role only → 403 for others
GET   /api/v1/auth/doctor-only/     → DOCTOR role only  → 403 for others
GET   /api/v1/auth/admin-only/      → ADMIN role only   → 403 for others
```

**Token usage:**
```http
Authorization: Bearer <access_token>
```

| Token | Lifetime |
|---|---|
| Access Token | 15 minutes |
| Refresh Token | 7 days (rotates on each use) |

---

## ⚙️ Environment Variables

See [`.env.example`](backend/.env.example) for all variables. Key ones:

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | *(required)* |
| `DB_NAME` | PostgreSQL database name | `healthos_db` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | *(required)* |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | Access token expiry | `15` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | Refresh token expiry | `7` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |

---

## 🧪 Running Tests

```bash
cd backend

# All tests
python manage.py test apps.accounts

# Individual suites
python manage.py test apps.accounts.tests.test_register
python manage.py test apps.accounts.tests.test_auth
python manage.py test apps.accounts.tests.test_permissions
```

**Coverage:**
- ✅ Registration (success, duplicate email, weak password, mismatch)
- ✅ Login (valid, invalid credentials, inactive user)
- ✅ Logout (token blacklist, requires auth)
- ✅ Token Refresh (valid, invalid, reuse after logout)
- ✅ RBAC (Patient / Doctor / Admin restrictions)
- ✅ Protected endpoint (with / without JWT)

---

## 📄 Documentation

| Document | Description |
|---|---|
| [01 Product Vision](docs/01_product_vision.md) | Goals, target users, roadmap |
| [02 Requirements Analysis](docs/02_requirements_analysis.md) | Functional & non-functional requirements |
| [03 System Architecture](docs/03_system_architecture.md) | Component diagrams, data flows |
| [04 Database Design](docs/04_database_design.md) | ERD, SQL schema, data retention |
| [05 API Design](docs/05_api_design.md) | Full REST API specification |

---

## 🗺 Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| ✅ Phase 0 | Week 1 | Project setup, architecture, documentation |
| ✅ Phase 1a | Week 2 | Secure authentication system (JWT + RBAC) |
| 🔄 Phase 1b | Weeks 3–4 | Health vault (document upload, categories) |
| 📋 Phase 2 | Weeks 5–8 | AI summarization, OCR, doctor sharing |
| 📋 Phase 3 | Weeks 9–12 | Trend analysis, health alerts, score |
| 📋 Phase 4 | Weeks 13–16 | FHIR integration, wearables, scale |

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">Built with ❤️ for better healthcare</div>
