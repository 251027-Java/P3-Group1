@echo off
REM Stop All Application Services Script for Windows

echo ==========================================
echo   Stopping P3-Group1 Application
echo ==========================================
echo.

echo Stopping all Java processes (Spring Boot services)...
taskkill /F /FI "WINDOWTITLE eq Eureka Server*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq API Gateway*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq React Backend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Angular Backend*" >nul 2>&1

echo Stopping all Node.js processes (Frontend services)...
taskkill /F /FI "WINDOWTITLE eq React Frontend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Angular Frontend*" >nul 2>&1

REM Alternative: Kill by port if window titles don't work
echo Stopping services by port...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8761" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8081" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8082" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4200" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo All services stopped successfully!
echo.

pause
