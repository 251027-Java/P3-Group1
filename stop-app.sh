#!/bin/bash

# Stop All Application Services Script

echo "=========================================="
echo "  Stopping P3-Group1 Application"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Read PIDs from file
if [ ! -f ".app-pids" ]; then
    echo -e "${YELLOW}No PID file found. Searching for processes...${NC}"
    
    # Try to find and kill by port
    echo "Stopping services by port..."
    
    # Eureka (8761)
    PID=$(lsof -ti:8761)
    if [ ! -z "$PID" ]; then
        echo "Stopping Eureka Server (PID: $PID)..."
        kill $PID
    fi
    
    # Gateway (8080)
    PID=$(lsof -ti:8080)
    if [ ! -z "$PID" ]; then
        echo "Stopping API Gateway (PID: $PID)..."
        kill $PID
    fi
    
    # React Backend (8082)
    PID=$(lsof -ti:8082)
    if [ ! -z "$PID" ]; then
        echo "Stopping React Backend (PID: $PID)..."
        kill $PID
    fi
    
    # Angular Backend (8081)
    PID=$(lsof -ti:8081)
    if [ ! -z "$PID" ]; then
        echo "Stopping Angular Backend (PID: $PID)..."
        kill $PID
    fi
    
    # React Frontend (5173)
    PID=$(lsof -ti:5173)
    if [ ! -z "$PID" ]; then
        echo "Stopping React Frontend (PID: $PID)..."
        kill $PID
    fi
    
    # Angular Frontend (4200)
    PID=$(lsof -ti:4200)
    if [ ! -z "$PID" ]; then
        echo "Stopping Angular Frontend (PID: $PID)..."
        kill $PID
    fi
    
else
    echo "Stopping services using saved PIDs..."
    
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping process $pid..."
            kill $pid
        else
            echo "Process $pid already stopped"
        fi
    done < .app-pids
    
    # Remove PID file
    rm .app-pids
fi

echo ""
echo "Waiting for processes to terminate..."
sleep 3

echo ""
echo -e "${GREEN}All services stopped successfully!${NC}"
echo ""
