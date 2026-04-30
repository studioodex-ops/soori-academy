@echo off
echo ========================================
echo   Soori Academy - Firebase Deploy
echo ========================================

REM Check if firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI not installed!
    echo Run: npm install -g firebase-tools
    pause
    exit /b 1
)

echo.
echo Installing Functions dependencies...
cd functions
call npm install
cd ..

echo.
echo Installing Web dependencies...
cd web
call npm install

echo.
echo Building Web...
call npm run build
cd ..

echo.
echo Deploying to Firebase...
call firebase deploy

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Website: https://soori-academy.web.app/
echo Admin:   https://soori-academy.web.app/admin
echo.
echo Password: soori2024
echo.
pause