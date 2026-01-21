#!/bin/bash

# Complete Application Startup Script
# This script starts the entire P3-Group1 application stack

echo "=========================================="
echo "  P3-Group1 Application Startup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load NVM and use Node 22
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Try to switch to Node 22
if command -v nvm &> /dev/null; then
    nvm install 22
    nvm use 22
else 
    echo -e "${YELLOW}Warning: nvm not found, using system node version${NC}"
fi


# Check if script is run from project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    echo "Expected structure: P3-Group1/"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}Port $1 is available${NC}"
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}Waiting for $name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}$name is ready!${NC}"
            return 0
        fi
        echo "  Attempt $attempt/$max_attempts..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}$name failed to start${NC}"
    return 1
}

echo "=========================================="
echo "  Step 1: Checking Prerequisites"
echo "=========================================="
echo ""

# Check Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    echo -e "${GREEN}✓ Java found: $JAVA_VERSION${NC}"
else
    echo -e "${RED}✗ Java not found. Please install Java 17 or higher${NC}"
    exit 1
fi

# Check Maven
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn -version | head -n 1 | cut -d' ' -f3)
    echo -e "${GREEN}✓ Maven found: $MVN_VERSION${NC}"
else
    echo -e "${RED}✗ Maven not found. Please install Maven${NC}"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18 or higher${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found. Please install npm${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo "  Step 2: Checking Ports"
echo "=========================================="
echo ""

check_port 8761  # Eureka Server
check_port 8080  # API Gateway
check_port 8081  # Angular Backend
check_port 8082  # React Backend
check_port 4200  # Angular Frontend
check_port 5173  # React Frontend (Vite)

echo ""
echo "=========================================="
echo "  Step 3: Starting Eureka Server"
echo "=========================================="
echo ""

cd backend/eureka-server/eureka-server || exit

echo "Building Eureka Server..."
mvn clean install -DskipTests

echo "Starting Eureka Server on port 8761..."
mvn spring-boot:run > ../../../logs/eureka.log 2>&1 &
EUREKA_PID=$!
echo "Eureka Server PID: $EUREKA_PID"

cd ../../..

# Wait for Eureka to be ready
wait_for_service "http://localhost:8761" "Eureka Server"

echo ""
echo "=========================================="
echo "  Step 4: Starting API Gateway"
echo "=========================================="
echo ""

cd backend/api-gateway/gateway || exit

echo "Building API Gateway..."
mvn clean install -DskipTests

echo "Starting API Gateway on port 8080..."
mvn spring-boot:run > ../../../logs/gateway.log 2>&1 &
GATEWAY_PID=$!
echo "API Gateway PID: $GATEWAY_PID"

cd ../../..

# Wait for Gateway to be ready
wait_for_service "http://localhost:8080/actuator/health" "API Gateway"

echo ""
echo "=========================================="
echo "  Step 5: Starting React Backend"
echo "=========================================="
echo ""

cd backend/React-spring-backend || exit

echo "Building React Backend..."
mvn clean install -DskipTests

echo "Starting React Backend on port 8082..."
mvn spring-boot:run > ../../logs/react-backend.log 2>&1 &
REACT_BACKEND_PID=$!
echo "React Backend PID: $REACT_BACKEND_PID"

cd ../..

# Wait for React Backend to be ready
wait_for_service "http://localhost:8082/api/users" "React Backend"

echo ""
echo "=========================================="
echo "  Step 6: Starting Angular Backend"
echo "=========================================="
echo ""

cd backend/Angular-spring-backend || exit

echo "Building Angular Backend..."
mvn clean install -DskipTests

echo "Starting Angular Backend on port 8081..."
mvn spring-boot:run > ../../logs/angular-backend.log 2>&1 &
ANGULAR_BACKEND_PID=$!
echo "Angular Backend PID: $ANGULAR_BACKEND_PID"

cd ../..

# Wait for Angular Backend to be ready
sleep 10

echo ""
echo "=========================================="
echo "  Step 7: Starting React Frontend"
echo "=========================================="
echo ""

cd frontend/react-child-app/P3-react-child-app || exit

echo "Installing React dependencies..."
npm install

echo "Starting React Frontend on port 5173..."
npm run dev > ../../../logs/react-frontend.log 2>&1 &
REACT_FRONTEND_PID=$!
echo "React Frontend PID: $REACT_FRONTEND_PID"

cd ../../..

# Wait for React Frontend to be ready
sleep 5

echo ""
echo "=========================================="
echo "  Step 8: Starting Angular Frontend"
echo "=========================================="
echo ""

cd frontend/angular-child-app/angular-child-app || exit

echo "Installing Angular dependencies..."
npm install

echo "Starting Angular Frontend on port 4200..."
npm start > ../../../logs/angular-frontend.log 2>&1 &
ANGULAR_FRONTEND_PID=$!
echo "Angular Frontend PID: $ANGULAR_FRONTEND_PID"

cd ../../..

# Wait for Angular Frontend to be ready
sleep 5

echo ""
echo "=========================================="
echo "  Application Started Successfully!"
echo "=========================================="
echo ""
echo -e "${GREEN}All services are now running!${NC}"
echo ""
echo "Service URLs:"
echo "  • Eureka Server:      http://localhost:8761"
echo "  • API Gateway:        http://localhost:8080"
echo "  • React Backend:      http://localhost:8082"
echo "  • Angular Backend:    http://localhost:8081"
echo "  • React Frontend:     http://localhost:5173"
echo "  • Angular Frontend:   http://localhost:4200"
echo ""
echo "Process IDs:"
echo "  • Eureka:     $EUREKA_PID"
echo "  • Gateway:    $GATEWAY_PID"
echo "  • React BE:   $REACT_BACKEND_PID"
echo "  • Angular BE: $ANGULAR_BACKEND_PID"
echo "  • React FE:   $REACT_FRONTEND_PID"
echo "  • Angular FE: $ANGULAR_FRONTEND_PID"
echo ""
echo "To stop all services, run: ./stop-app.sh"
echo ""
echo "Logs are available in: ./logs/"
echo ""

# Save PIDs to file for stop script
echo "$EUREKA_PID" > .app-pids
echo "$GATEWAY_PID" >> .app-pids
echo "$REACT_BACKEND_PID" >> .app-pids
echo "$ANGULAR_BACKEND_PID" >> .app-pids
echo "$REACT_FRONTEND_PID" >> .app-pids
echo "$ANGULAR_FRONTEND_PID" >> .app-pids

echo "=========================================="
echo ""
