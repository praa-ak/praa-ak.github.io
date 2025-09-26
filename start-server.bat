@echo off
echo Starting local web server for your website...
echo.
echo Open your browser and go to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python server...
    python -m http.server 3000
) else (
    REM Check if Node.js is available
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Using Node.js server...
        npx http-server -p 3000
    ) else (
        echo ERROR: Neither Python nor Node.js found!
        echo Please install Python or Node.js to run a local server.
        echo.
        echo Alternative: Try opening index.html directly in Chrome with --allow-file-access-from-files flag
        pause
    )
)