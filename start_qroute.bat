@echo off
title Q-ROUTE - Full-Stack Hackathon Prototype
echo ========================================================
echo   Q-ROUTE: Quantum-Inspired Traffic Optimization System
echo   Smarter Routes. Less Traffic. Better Journeys.
echo ========================================================
echo.

REM Set Node path if available in system or scratch
if exist "%USERPROFILE%\.gemini\antigravity\scratch\nodejs\node.exe" (
  set "PATH=%USERPROFILE%\.gemini\antigravity\scratch\nodejs;%PATH%"
) else if exist "%~dp0..\nodejs\node.exe" (
  set "PATH=%~dp0..\nodejs;%PATH%"
)

echo [1/2] Starting Q-Route Full-Stack Server on port 5000...
cd /d "%~dp0backend"
start http://localhost:5000
node src/server.js
pause
