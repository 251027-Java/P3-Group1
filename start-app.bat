@echo off
REM Complete Application Startup Script for Windows
REM This script starts the entire P3-Group1 application stack

echo ==========================================
echo   P3-Group1 Application Startup
echo ==========================================
echo.

REM Check if script is run from project root
if not exist "backend" (
    echo Error: Please run this script from the project root directory
    echo Expected structure: P3-Group1/
    exit /b 1
)

if not exist "frontend" (
    echo Error: Please run this script from the project root directory
    echo Expected structure: P3-Group1/
    exit /b 1
)

echo ==========================================
echo   Step 1: Checking Prerequisites
echo ==========================================
echo.

REM Check Java
where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java not found. Please install Java 17 or higher
    exit /b 1
)
echo [OK] Java found

REM Check Maven
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven not found. Please install Maven
    exit /b 1
)
echo [OK] Maven found

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18 or higher
    exit /b 1
)
echo [OK] Node.js found

REM Check npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found. Please install npm
    exit /b 1
)
echo [OK] npm found

echo.
echo ==========================================
echo   Step 2: Creating logs directory
echo ==========================================
echo.

if not exist "logs" mkdir logs

echo.
echo ==========================================
echo   Step 3: Starting Eureka Server
echo ==========================================
echo.

cd backend\eureka-server\eureka-server
echo Building Eureka Server...
call mvn clean install -DskipTests

echo Starting Eureka Server on port 8761...
start "Eureka Server" cmd /k "mvn spring-boot:run"

cd ..\..\..
timeout /t 30 /nobreak >nul

echo.
echo ==========================================
echo   Step 4: Starting API Gateway
echo ==========================================
echo.

cd backend\api-gateway\gateway
echo Building API Gateway...
call mvn clean install -DskipTests

echo Starting API Gateway on port 8080...
start "API Gateway" cmd /k "mvn spring-boot:run"

cd ..\..\..
timeout /t 20 /nobreak >nul

echo.
echo ==========================================
echo   Step 5: Starting React Backend
echo ==========================================
echo.

cd backend\React-spring-backend
echo Building React Backend...
call mvn clean install -DskipTests

echo Starting React Backend on port 8082...
start "React Backend" cmd /k "mvn spring-boot:run"

cd ..\..
timeout /t 20 /nobreak >nul

echo.
echo ==========================================
echo   Step 6: Starting Angular Backend
echo ==========================================
echo.

cd backend\Angular-spring-backend
echo Building Angular Backend...
call mvn clean install -DskipTests

echo Starting Angular Backend on port 8081...
start "Angular Backend" cmd /k "mvn spring-boot:run"

cd ..\..
timeout /t 20 /nobreak >nul

echo.
echo ==========================================
echo   Step 7: Starting React Frontend
echo ==========================================
echo.

cd frontend\react-child-app\P3-react-child-app
echo Installing React dependencies...
call npm install

echo Starting React Frontend on port 5173...
start "React Frontend" cmd /k "npm run dev"

cd ..\..\..
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo   Step 8: Starting Angular Frontend
echo ==========================================
echo.

cd frontend\angular-child-app\angular-child-app
echo Installing Angular dependencies...
call npm install

echo Starting Angular Frontend on port 4200...
start "Angular Frontend" cmd /k "npm start"

cd ..\..\..

echo.
echo ==========================================
echo   Application Started Successfully!
echo ==========================================
echo.
echo All services are now running!
echo.
echo Service URLs:
echo   * Eureka Server:      http://localhost:8761
echo   * API Gateway:        http://localhost:8080
echo   * React Backend:      http://localhost:8082
echo   * Angular Backend:    http://localhost:8081
echo   * React Frontend:     http://localhost:5173
echo   * Angular Frontend:   http://localhost:4200
echo.
echo To stop all services, close all the command windows
echo or run: stop-app.bat
echo.
echo ==========================================
echo.

pause
