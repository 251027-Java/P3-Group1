# User Profile API - Docker Compose Setup Guide

## ✅ Changes Made for Docker Compose

### 1. **Updated UserController Endpoints**

Changed from `/api/users` to `/users` to work with API Gateway routing.

**Backend Controller:**
- Endpoints are now at `/users/*` (e.g., `/users/1`, `/users/1/library`)
- Gateway routes `/api/react/**` → rewrites to `/**` → forwards to React backend

**Client Access:**
- Clients call: `http://localhost:8080/api/react/users/1`
- Gateway rewrites to: `/users/1`
- React backend receives: `/users/1` ✅

### 2. **API Gateway Routing**

From `docker-compose.yml`:
```yaml
SPRING_CLOUD_GATEWAY_ROUTES_0_ID: react-backend-route
SPRING_CLOUD_GATEWAY_ROUTES_0_URI: lb://REACT-SPRING-SERVICE
SPRING_CLOUD_GATEWAY_ROUTES_0_PREDICATES_0: Path=/api/react/**
SPRING_CLOUD_GATEWAY_ROUTES_0_FILTERS_0: RewritePath=/api/react/(?<segment>.*), /$$\{segment}
```

**How it works:**
1. Client → Gateway: `http://localhost:8080/api/react/users/1`
2. Gateway matches: `/api/react/**`
3. Gateway rewrites: `/api/react/users/1` → `/users/1`
4. Gateway forwards to: `react-backend:8080/users/1`
5. React backend processes request at `/users/1`

---

## 🚀 Testing with Docker Compose

### Start the Services

```bash
# Start all services
docker-compose up -d

# Watch logs
docker-compose logs -f react-backend api-gateway

# Check service health
docker-compose ps
```

### Test Endpoints

**1. Test Gateway is Running:**
```bash
curl http://localhost:8080/actuator/health
```

**2. Test User Endpoints (through Gateway):**
```bash
# Get all users
curl http://localhost:8080/api/react

# Get specific user
curl http://localhost:8080/api/react/users/1

# Get user statistics
curl http://localhost:8080/api/react/users/1/statistics

# Get user's library
curl http://localhost:8080/api/react/users/1/library

# Get full library with game details
curl http://localhost:8080/api/react/users/1/library/full
```

**3. Test Direct Backend Access (for debugging):**
```bash
# Direct to react-backend container
curl http://localhost:8081/users/1
```

---

## 🔍 URL Structure

### Gateway URLs (Use These in Your Frontend)

```
http://localhost:8080/api/react/users/{id}
http://localhost:8080/api/react/users/{id}/profile
http://localhost:8080/api/react/users/{id}/statistics
http://localhost:8080/api/react/users/{id}/friends
http://localhost:8080/api/react/users/{id}/library
http://localhost:8080/api/react/users/{id}/library/full
http://localhost:8080/api/react/users/{id}/wishlist
http://localhost:8080/api/react/users/{id}/wishlist/full
http://localhost:8080/api/react/users/{id}/rewards
http://localhost:8080/api/react/users/{id}/notifications
http://localhost:8080/api/react/users/{id}/posts
```

### Direct Backend URLs (Development Only)

```
http://localhost:8081/users/{id}
http://localhost:8081/users/{id}/profile
http://localhost:8081/users/{id}/statistics
...etc
```

---

## 📝 Environment Variables

### For Frontend (React)

Update your React app to use the gateway URL:

```javascript
// .env or config
const API_BASE_URL = 'http://localhost:8080/api/react';

// In your code
fetch(`${API_BASE_URL}/users/1`)
```

Or use relative URLs if your frontend is served through the same gateway:

```javascript
// Frontend served at http://localhost:8080
fetch('/api/react/users/1')
```

---

## 🐛 Troubleshooting

### Issue: 404 Not Found

**Problem:** Gateway can't find the route
```bash
# Check if gateway is routing correctly
curl -v http://localhost:8080/api/react/users/1
```

**Solution:** Verify gateway routes are configured:
```bash
docker-compose exec api-gateway env | grep GATEWAY
```

### Issue: Connection Refused

**Problem:** Backend service not ready
```bash
# Check backend health
curl http://localhost:8081/actuator/health

# Check logs
docker-compose logs react-backend
```

**Solution:** Wait for services to be healthy:
```bash
docker-compose ps
# All services should show "healthy"
```

### Issue: Gateway Routes to Wrong Service

**Problem:** Angular and React URLs confused

**Check:**
- `/api/angular/**` → Angular backend
- `/api/react/**` → React backend

**Solution:** Make sure you're using `/api/react/` prefix for React backend calls.

---

## 🔄 Service Communication

### Between Services (Internal)

Services communicate using service names:
```javascript
// From Angular backend to React backend
fetch('http://react-backend:8080/users/1')
```

### From Frontend (External)

Always go through the gateway:
```javascript
// From browser
fetch('http://localhost:8080/api/react/users/1')
```

---

## 📊 Port Mapping

| Service | Container Port | Host Port | Access |
|---------|---------------|-----------|--------|
| API Gateway | 8080 | 8080 | http://localhost:8080 |
| React Backend | 8080 | 8081 | http://localhost:8081 (direct) |
| Angular Backend | 8080 | 8082 | http://localhost:8082 (direct) |
| Eureka Server | 8761 | 8761 | http://localhost:8761 |
| Postgres | 5432 | 5432 | postgresql://localhost:5432 |

---

## ✅ Verification Checklist

- [ ] Docker Compose services are all healthy
- [ ] Gateway is accessible at port 8080
- [ ] React backend is registered with Eureka
- [ ] Can fetch users through gateway: `/api/react/users/1`
- [ ] Can fetch user library: `/api/react/users/1/library/full`
- [ ] Can update user profile: `PUT /api/react/users/1/profile`
- [ ] All CRUD operations work correctly

---

## 📚 Related Documentation

- **Full API Reference:** `backend/React-spring-backend/USER_PROFILE_API_DOCUMENTATION.md`
- **Quick Start Guide:** `REACT_USER_PROFILE_QUICKSTART.md`
- **Docker Compose File:** `docker-compose.yml`

---

## 🎯 Summary

**What Changed:**
1. UserController: `/api/users` → `/users`
2. All documentation updated to show `/api/react/users` for gateway access
3. Comments in controller show both gateway and direct URLs

**How to Use:**
1. Start services: `docker-compose up -d`
2. Access through gateway: `http://localhost:8080/api/react/users/1`
3. Frontend should always use `/api/react/` prefix

**Perfect for:**
- Production deployment
- Team integration
- Service-to-service communication
- Centralized routing and logging

---

**Last Updated:** January 21, 2026
**Status:** ✅ Ready for Docker Compose
