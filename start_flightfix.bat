@echo off
title FlightFix Launcher
cd /d "%~dp0"

echo ========================================================
echo Launching FlightFix Aircraft Maintenance System...
echo ========================================================

echo 1. Starting Backend (Django on port 8000)...
start "FlightFix Backend" cmd /c "cd /d %~dp0backend && call venv\Scripts\activate.bat && python manage.py runserver 127.0.0.1:8000"

timeout /t 3 /nobreak > nul

echo 2. Starting Frontend (Vite on port 5173)...
start "FlightFix Frontend" cmd /c "cd /d %~dp0frontend && call npm.cmd run dev"

echo.
echo Both servers are launching!
echo Backend:  http://127.0.0.1:8000/api/
echo Swagger:  http://127.0.0.1:8000/api/docs/
echo Frontend: http://localhost:5173/
echo.
pause
