@echo off
echo Starting Blog Platform with Docker...
echo.

echo Building and starting containers...
docker-compose up --build

echo.
echo Blog Platform is running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the services... 