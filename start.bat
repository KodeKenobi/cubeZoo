@echo off
echo Starting Blog Platform...
echo.

echo Starting Backend (FastAPI)...
start "Backend" cmd /k "cd backend && python run.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend (React)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Blog Platform is starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit this script...
pause > nul 