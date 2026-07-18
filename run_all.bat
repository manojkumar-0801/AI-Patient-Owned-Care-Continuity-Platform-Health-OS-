@echo off
echo Starting Backend (Django)...
start cmd /k "cd backend && .\venv\Scripts\activate && python manage.py runserver"

echo Starting Frontend (Vite)...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in new terminal windows!
