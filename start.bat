@echo off
echo ========================================
echo   Agent Chatbot Startup Script
echo ========================================
echo.

echo [1/4] Checking Ollama...
ollama list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found! Please install from https://ollama.ai/
    pause
    exit /b 1
)
echo ✅ Ollama is installed

echo.
echo [2/4] Starting Ollama with Mistral 7B...
start "Ollama" cmd /k "ollama run mistral:7b"
timeout /t 3 >nul

echo.
echo [3/4] Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"
timeout /t 5 >nul

echo.
echo [4/4] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo ✅ All services started!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WindowTitle eq Ollama*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend*" /T /F >nul 2>&1

echo ✅ All services stopped
pause
