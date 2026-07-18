# 📂 migrations — Database Schema History

This directory tracks all database schema changes for the `accounts` app.

---

## Migration Files

| File | Description |
|---|---|
| `0001_initial.py` | Creates `users` and `user_profiles` tables with all fields, constraints, and indexes |

---

## Common Commands

```bash
# Apply all pending migrations
python manage.py migrate

# Apply only accounts app migrations
python manage.py migrate accounts

# Check migration status
python manage.py showmigrations accounts

# Create new migration after model changes
python manage.py makemigrations accounts

# Preview SQL for a migration (without running it)
python manage.py sqlmigrate accounts 0001
```

---

## Schema Overview

### `users` table
```sql
id            UUID PRIMARY KEY
email         VARCHAR(254) UNIQUE NOT NULL
phone         VARCHAR(20) UNIQUE
role          VARCHAR(20) CHECK (IN 'PATIENT','DOCTOR','ADMIN')
is_active     BOOLEAN DEFAULT TRUE
is_verified   BOOLEAN DEFAULT FALSE
mfa_enabled   BOOLEAN DEFAULT FALSE
mfa_secret    VARCHAR(64)
last_login_at TIMESTAMPTZ
created_at    TIMESTAMPTZ
updated_at    TIMESTAMPTZ
deleted_at    TIMESTAMPTZ   -- soft delete
```

### `user_profiles` table
```sql
user_id             UUID PRIMARY KEY FK → users.id
first_name          VARCHAR(100)
last_name           VARCHAR(100)
date_of_birth       DATE
gender              VARCHAR(25)
blood_type          VARCHAR(5)
allergies           JSONB DEFAULT '[]'
chronic_conditions  JSONB DEFAULT '[]'
current_medications JSONB DEFAULT '[]'
emergency_name      VARCHAR(200)
emergency_phone     VARCHAR(20)
emergency_relation  VARCHAR(50)
profile_photo_url   VARCHAR(500)
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

---

> ⚠️ **Never edit migration files manually after they have been applied to any environment.**
> Always use `python manage.py makemigrations` to generate new migrations.
