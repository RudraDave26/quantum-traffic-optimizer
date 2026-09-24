@echo off
title Q-ROUTE Public Web Hosting Tunnel (Cloudflare)
echo ========================================================
echo   Q-ROUTE: Public Web Hosting Tunnel
echo   Exposing http://localhost:5000 to the Public Internet
echo ========================================================
echo.

if exist "%USERPROFILE%\.gemini\antigravity\scratch\nodejs\node.exe" (
  set "PATH=%USERPROFILE%\.gemini\antigravity\scratch\nodejs;%PATH%"
)

echo Checking if Q-Route server is running on port 5000...
powershell -Command "try { $res = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -TimeoutSec 3; Write-Host '>> Q-Route Backend is ONLINE!' -ForegroundColor Green } catch { Write-Host '>> Warning: Local server not detected on port 5000. Please run start_qroute.bat first.' -ForegroundColor Yellow }"
echo.

if exist "%~dp0tools\cloudflared.exe" (
  echo Starting Cloudflare Tunnel (High-speed, zero-timeout, SSL encrypted)...
  echo Look for the 'https://...trycloudflare.com' link below:
  echo ========================================================
  "%~dp0tools\cloudflared.exe" tunnel --url http://localhost:5000
) else (
  echo Cloudflare binary not found. Falling back to SSH tunnel...
  ssh -R 80:localhost:5000 -o StrictHostKeyChecking=no nokey@localhost.run
)

pause
