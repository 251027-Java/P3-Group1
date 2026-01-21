#!/bin/bash

# Simple Sequential Startup (for Claude Terminal)
# This runs services one by one in the same terminal

cd /Users/fahadnawaz/Documents/Revature/P3/P3-Group1

echo "=========================================="
echo "  Starting Backend Services"
echo "=========================================="
echo ""

# Start Eureka Server
echo "Starting Eureka Server..."
cd backend/eureka-server/eureka-server
mvn spring-boot:run &
EUREKA_PID=$!
cd ../../..
sleep 30

# Start API Gateway
echo "Starting API Gateway..."
cd backend/api-gateway/gateway
mvn spring-boot:run &
GATEWAY_PID=$!
cd ../../..
sleep 20

# Start React Backend
echo "Starting React Backend..."
cd backend/React-spring-backend
mvn spring-boot:run &
REACT_BACKEND_PID=$!
cd ../..
sleep 20

echo ""
echo "=========================================="
echo "  Starting Frontend Services"
echo "=========================================="
echo ""

# Start React Frontend
echo "Starting React Frontend..."
cd frontend/react-child-app/P3-react-child-app
npm install
npm run dev &
REACT_FRONTEND_PID=$!
cd ../../..

echo ""
echo "=========================================="
echo "  All Services Started!"
echo "=========================================="
echo ""
echo "Access your application at:"
echo "  • React Frontend: http://localhost:5173"
echo "  • Eureka Server:  http://localhost:8761"
echo "  • API Gateway:    http://localhost:8080"
echo "  • React Backend:  http://localhost:8082"
echo ""
echo "Process IDs:"
echo "  Eureka:     $EUREKA_PID"
echo "  Gateway:    $GATEWAY_PID"
echo "  React BE:   $REACT_BACKEND_PID"
echo "  React FE:   $REACT_FRONTEND_PID"
echo ""
echo "To stop: kill $EUREKA_PID $GATEWAY_PID $REACT_BACKEND_PID $REACT_FRONTEND_PID"
echo ""

# Keep script running
wait
