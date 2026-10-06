@echo off
title FOODOVA Launcher
echo ===================================================
echo   🍔 FOODOVA - Full Stack Application Launcher
echo ===================================================
echo.
echo Starting Backend (Port 5000) and Frontend (Port 5173)...
echo.

start "FOODOVA Backend (:5000)" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 /nobreak >nul
start "FOODOVA Frontend (:5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are launching in separate terminal windows!
echo - Backend:  http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo You can close this window now.
pause
