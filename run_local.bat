@echo off
title Germelon Platform Launcher
echo ========================================================
echo   Launching Germelon — Global Agricultural Intelligence
echo ========================================================
echo.

start "Germelon Backend (FastAPI)" cmd /k "cd /d %~dp0terramind\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 /nobreak >nul

start "Germelon Frontend (Vite React)" cmd /k "cd /d %~dp0terramind\frontend && npm run dev -- --host 0.0.0.0 --port 5173"

echo.
echo Both services launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8000
echo - Swagger:  http://localhost:8000/docs
echo.
pause

