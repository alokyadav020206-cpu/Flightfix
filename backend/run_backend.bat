@echo off
title FlightFix Django Backend
cd /d "%~dp0"
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Starting Django Development Server on http://127.0.0.1:8000/ ...
python manage.py runserver 127.0.0.1:8000
pause
