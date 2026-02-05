#!/bin/bash

# DeAnalyse Startup Script

cleanup() {
    echo "Stopping DeAnalyse..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

echo "=================================="
echo "   Starting DeAnalyse System"
echo "=================================="

# Check Backend
if [ -d "backend" ]; then
    echo "[INFO] Starting Backend Server..."
    cd backend
    
    if [ ! -d "venv" ]; then
        echo "[INFO] Creating Python virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        echo "[INFO] Installing backend dependencies..."
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    python main.py &
    BACKEND_PID=$!
    echo "[INFO] Backend running (PID: $BACKEND_PID)"
    cd ..
else
    echo "[ERROR] Backend directory not found!"
    exit 1
fi

echo "=================================="
echo "[INFO] Starting Frontend..."
echo "=================================="

npm run dev

kill $BACKEND_PID
