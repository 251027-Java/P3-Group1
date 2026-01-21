# 🚀 Complete Application Startup Guide

## Quick Start

### For Mac/Linux:
```bash
# Make scripts executable
chmod +x start-app.sh stop-app.sh

# Start all services
./start-app.sh

# Stop all services
./stop-app.sh
```

### For Windows:
```batch
REM Start all services
start-app.bat

REM Stop all services
stop-app.bat
```

---

## Manual Startup (If Scripts Don't Work)

### Prerequisites

Ensure you have installed:
- ✅ Java 17 or higher
- ✅ Maven 3.8+
- ✅ Node.js 18+
- ✅ npm 9+
- ✅ PostgreSQL (running on default port 5432)

### Database Setup

1. **Create Database:**
```sql
CREATE DATABASE p3_database;
```

2. **Run Migrations** (if you have migration files):
```bash
# Navigate to backend
cd backend/React-spring-backend

# Update application.properties with your database credentials
# Then run the application once to create tables
```

3. **Initialize Data:**
```sql
-- Insert test user
INSERT INTO users (display_name, display_image, level, can_sell) 
VALUES ('TestUser', NULL, 'USER', false);

-- Insert playable games
INSERT INTO playable_games (name, description) VALUES
('Bubble Trouble', 'Pop all the bubbles without getting hit'),
('Flappy Bird', 'Fly through pipes without crashing');
```

---

## Step-by-Step Manual Startup

### Step 1: Start Eureka Server (Service Discovery)

```bash
# Terminal 1
cd backend/eureka-server/eureka-server
mvn clean install -DskipTests
mvn spring-boot:run
```

**Wait for:** Console shows "Started EurekaServerApplication"
**Check:** http://localhost:8761

---

### Step 2: Start API Gateway

```bash
# Terminal 2
cd backend/api-gateway/gateway
mvn clean install -DskipTests
mvn spring-boot:run
```

**Wait for:** Console shows "Started GatewayApplication"
**Check:** http://localhost:8080/actuator/health

---

### Step 3: Start React Backend

```bash
# Terminal 3
cd backend/React-spring-backend
mvn clean install -DskipTests
mvn spring-boot:run
```

**Wait for:** Console shows "Started ReactSpringServiceApplication"
**Check:** http://localhost:8082/api/users

---

### Step 4: Start Angular Backend (Optional)

```bash
# Terminal 4
cd backend/Angular-spring-backend
mvn clean install -DskipTests
mvn spring-boot:run
```

**Wait for:** Console shows "Started AngularSpringServiceApplication"
**Check:** http://localhost:8081

---

### Step 5: Start React Frontend

```bash
# Terminal 5
cd frontend/react-child-app/P3-react-child-app
npm install
npm run dev
```

**Wait for:** Console shows "Local: http://localhost:5173"
**Check:** http://localhost:5173

---

### Step 6: Start Angular Frontend (Optional)

```bash
# Terminal 6
cd frontend/angular-child-app/angular-child-app
npm install
npm start
```

**Wait for:** Console shows "Compiled successfully"
**Check:** http://localhost:4200

---

## Service URLs & Ports

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Eureka Server** | 8761 | http://localhost:8761 | Service Discovery |
| **API Gateway** | 8080 | http://localhost:8080 | API Gateway/Router |
| **React Backend** | 8082 | http://localhost:8082 | Main Backend API |
| **Angular Backend** | 8081 | http://localhost:8081 | Secondary Backend |
| **React Frontend** | 5173 | http://localhost:5173 | Main Frontend (Vite) |
| **Angular Frontend** | 4200 | http://localhost:4200 | Secondary Frontend |

---

## Testing the Application

### 1. Check Eureka Dashboard
Visit: http://localhost:8761

You should see registered services:
- API-GATEWAY
- ANGULAR-SPRING-SERVICE (if started)
- REACT-SPRING-SERVICE

### 2. Test Backend APIs

```bash
# Get all users
curl http://localhost:8082/api/users

# Get all games
curl http://localhost:8082/api/games

# Get playable games
curl http://localhost:8082/api/playable-games

# Submit a score (requires user_id and game_id)
curl -X POST http://localhost:8082/api/game-scores \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"gameId":1,"score":1500,"level":7}'

# Get leaderboard
curl http://localhost:8082/api/game-scores/leaderboard/1?limit=10
```

### 3. Test Frontend
- Open http://localhost:5173
- Navigate to games section
- Play Bubble Trouble or Flappy Bird
- Check if scores are saved

---

## Common Issues & Solutions

### Issue: Port Already in Use

**Solution:**
```bash
# Mac/Linux - Kill process on port
lsof -ti:8080 | xargs kill -9

# Windows - Kill process on port
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Maven Build Fails

**Solution:**
```bash
# Clean Maven cache
mvn clean
rm -rf ~/.m2/repository

# Rebuild
mvn clean install -DskipTests
```

### Issue: Database Connection Failed

**Solution:**
1. Check PostgreSQL is running:
```bash
# Mac
brew services list

# Linux
sudo service postgresql status

# Windows
services.msc (look for PostgreSQL)
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/p3_database
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Issue: Frontend Can't Connect to Backend

**Solution:**
1. Check CORS settings in backend
2. Verify backend is running on correct port
3. Check frontend API base URL configuration

### Issue: Eureka Not Discovering Services

**Solution:**
1. Wait 30-60 seconds for registration
2. Check backend application.properties:
```properties
eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/
eureka.instance.preferIpAddress=true
```

### Issue: React Frontend Build Errors

**Solution:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

---

## Development Mode vs Production

### Development Mode (Current Setup)
- Hot reload enabled
- Debug logging
- CORS open
- No authentication

### For Production:
1. Build frontend:
```bash
# React
npm run build

# Angular
ng build --prod
```

2. Package backend:
```bash
mvn clean package -DskipTests
```

3. Run JARs:
```bash
java -jar target/app.jar
```

---

## Environment Variables

### Backend
```bash
# Database
export DB_URL=jdbc:postgresql://localhost:5432/p3_database
export DB_USERNAME=postgres
export DB_PASSWORD=password

# Eureka
export EUREKA_URL=http://localhost:8761/eureka/

# Server Port
export SERVER_PORT=8082
```

### Frontend
```bash
# API Base URL
export VITE_API_URL=http://localhost:8082
```

---

## Monitoring & Logs

### View Logs (Script Mode)
```bash
# All logs are in ./logs/ directory
tail -f logs/eureka.log
tail -f logs/gateway.log
tail -f logs/react-backend.log
tail -f logs/react-frontend.log
```

### View Logs (Manual Mode)
Logs appear in the terminal where you started each service

### Health Checks
```bash
# Eureka
curl http://localhost:8761/actuator/health

# Gateway
curl http://localhost:8080/actuator/health

# React Backend
curl http://localhost:8082/actuator/health
```

---

## Stopping the Application

### Using Scripts:
```bash
# Mac/Linux
./stop-app.sh

# Windows
stop-app.bat
```

### Manual Stop:
Press `Ctrl+C` in each terminal window where services are running

### Force Kill:
```bash
# Mac/Linux - Kill all Java processes
pkill -9 java

# Kill all Node processes
pkill -9 node

# Windows - Kill all Java processes
taskkill /F /IM java.exe

# Kill all Node processes
taskkill /F /IM node.exe
```

---

## Startup Checklist

- [ ] PostgreSQL is running
- [ ] Database created and migrated
- [ ] Test data inserted
- [ ] Ports 8761, 8080, 8081, 8082, 4200, 5173 are free
- [ ] Java 17+ installed
- [ ] Maven installed
- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm install`, `mvn install`)

---

## Quick Commands Reference

```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check Node version
node -v

# Check npm version
npm -v

# Check PostgreSQL status
psql --version

# Check which process is using a port
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill a process by port
kill -9 $(lsof -ti:8080)  # Mac/Linux
taskkill /F /PID <PID>  # Windows
```

---

## Support

If you encounter issues:
1. Check logs in `./logs/` directory
2. Verify all prerequisites are installed
3. Check database connectivity
4. Ensure all ports are available
5. Review error messages in console

---

## Success Indicators

✅ **Eureka Dashboard** shows registered services
✅ **Gateway** responds to health check
✅ **Backend APIs** return data
✅ **Frontend** loads in browser
✅ **Games** are playable
✅ **Scores** are saved to database

---

**You're all set! The complete application should now be running.** 🎉
