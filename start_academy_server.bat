@echo off
title Interactive ML & LureLock Academies Server (Port 8765)
cd /d "%~dp0"
echo ===============================================================================
echo   Starting Interactive Machine Learning ^& LureLock Academy Hub (Port 8765)
echo ===============================================================================
echo.
start "" "http://localhost:8765/"
python ml_academy_server.py
pause
