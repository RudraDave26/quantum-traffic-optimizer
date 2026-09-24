@echo off
title Q-ROUTE Development Mode (Port 3000 + Port 5000)
echo ========================================================
echo   Starting Q-ROUTE in Dual Dev Mode (Backend + Vite HMR)
echo ========================================================

if exist "%USERPROFILE%\.gemini\antigravity\scratch\nodejs\node.exe" (
  set "PATH=%USERPROFILE%\.gemini\antigravity\scratch\nodejs;%PATH%"
) else if exist "%~dp0..\nodejs\node.exe" (
  set "PATH=%~dp0..\nodejs;%PATH%"
)

start "Q-Route Backend (5000)" cmd /k "cd /d %~dp0backend && node src/server.js"
timeout /t 2 >nul
start "Q-Route Frontend Vite (3000)" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 2 >nul
start http://localhost:3000
