#!/bin/bash
echo "Starting local web server for your website..."
echo ""
echo "Open your browser and go to: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Using Python 3 server..."
    python3 -m http.server 3000
elif command -v python &> /dev/null; then
    echo "Using Python server..."
    python -m http.server 3000
elif command -v node &> /dev/null; then
    echo "Using Node.js server..."
    npx http-server -p 3000
else
    echo "ERROR: Neither Python nor Node.js found!"
    echo "Please install Python or Node.js to run a local server."
    echo ""
    echo "Alternative: Try opening index.html directly in Chrome with --allow-file-access-from-files flag"
fi