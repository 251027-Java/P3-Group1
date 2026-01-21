# 🎯 Quick Start - Run Complete Application

## Option 1: Automated Scripts (Recommended)

### Mac/Linux:
```bash
chmod +x start-app.sh stop-app.sh
./start-app.sh    # Start everything
./stop-app.sh     # Stop everything
```

### Windows:
```batch
start-app.bat     # Start everything
stop-app.bat      # Stop everything
```

---

## Option 2: Manual (6 Terminals)

```bash
# Terminal 1 - Eureka (Service Discovery)
cd backend/eureka-server/eureka-server
mvn spring-boot:run

# Terminal 2 - API Gateway  
cd backend/api-gateway/gateway
mvn spring-boot:run

# Terminal 3 - React Backend
cd backend/React-spring-backend
mvn spring-boot:run

# Terminal 4 - Angular Backend (optional)
cd backend/Angular-spring-backend
mvn spring-boot:run

# Terminal 5 - React Frontend
cd frontend/react-child-app/P3-react-child-app
npm install && npm run dev

# Terminal 6 - Angular Frontend (optional)
cd frontend/angular-child-app/angular-child-app
npm install && npm start
```

---

## Access Points

```
✅ Eureka:         http://localhost:8761
✅ Gateway:        http://localhost:8080
✅ React Backend:  http://localhost:8082
✅ React Frontend: http://localhost:5173  ← MAIN APP
✅ Angular FE:     http://localhost:4200
```

---

## Prerequisites

```bash
✅ Java 17+        java -version
✅ Maven 3.8+      mvn -version
✅ Node.js 18+     node -v
✅ npm 9+          npm -v
✅ PostgreSQL      psql --version
```

---

## Database Setup

```sql
CREATE DATABASE p3_database;

INSERT INTO users (display_name, level, can_sell) 
VALUES ('TestUser', 'USER', false);

INSERT INTO playable_games (name, description) VALUES
('Bubble Trouble', 'Pop bubbles game'),
('Flappy Bird', 'Fly through pipes');
```

---

## Test It Works

```bash
# Backend
curl http://localhost:8082/api/users
curl http://localhost:8082/api/playable-games

# Frontend
open http://localhost:5173
```

---

## Common Issues

**Port in use:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8080   # Windows - then taskkill /PID <PID> /F
```

**Database error:**
```bash
# Check PostgreSQL running
brew services list  # Mac
sudo service postgresql status  # Linux
services.msc  # Windows
```

**Can't connect:**
- Wait 30 seconds for services to register
- Check Eureka dashboard: http://localhost:8761
- Check logs in ./logs/ directory

---

## Stop Everything

```bash
./stop-app.sh  # Mac/Linux
stop-app.bat   # Windows

# Or manually: Ctrl+C in each terminal
```

---

## Files Created

```
P3-Group1/
├── start-app.sh       ← Mac/Linux startup
├── start-app.bat      ← Windows startup
├── stop-app.sh        ← Mac/Linux shutdown
├── stop-app.bat       ← Windows shutdown
└── STARTUP_GUIDE.md   ← Full instructions
```

---

## Startup Order (Important!)

1. **Eureka** (8761) - Service discovery FIRST
2. **Gateway** (8080) - After Eureka is ready
3. **Backends** (8081, 8082) - After Gateway
4. **Frontends** (4200, 5173) - Last

**Wait 30-60 seconds between each step!**

---

**Open http://localhost:5173 and you're ready to go!** 🚀
