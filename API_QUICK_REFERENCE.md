# 🚀 User Profile API - Quick Reference Card

## Base URL (Docker Compose)
```
http://localhost:8080/api/react
```

---

## 📌 Most Used Endpoints

### Get User Info
```bash
GET /api/react/users/{id}
curl http://localhost:8080/api/react/users/1
```

### Get User's Game Library
```bash
GET /api/react/users/{id}/library/full
curl http://localhost:8080/api/react/users/1/library/full
```

### Add Game to Library
```bash
POST /api/react/users/{id}/library/{gameId}
curl -X POST http://localhost:8080/api/react/users/1/library/5
```

### Get User Statistics
```bash
GET /api/react/users/{id}/statistics
curl http://localhost:8080/api/react/users/1/statistics
```

### Update Profile
```bash
PUT /api/react/users/{id}/profile
curl -X PUT http://localhost:8080/api/react/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{"displayName":"NewName","canSell":true}'
```

---

## 💻 Frontend Examples

### React/JavaScript
```javascript
// Get user
const user = await fetch('/api/react/users/1').then(r => r.json());

// Get library
const library = await fetch('/api/react/users/1/library/full').then(r => r.json());

// Add to library
await fetch('/api/react/users/1/library/5', { method: 'POST' });

// Check if owns game
const libraryIds = await fetch('/api/react/users/1/library').then(r => r.json());
const owns = libraryIds.includes(gameId);
```

### TypeScript
```typescript
interface User {
  id: number;
  displayName: string;
  level: 'USER' | 'DEVELOPER';
  gamesInLibrary: number[];
  wishlist: number[];
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/react/users/${id}`);
  return response.json();
};
```

---

## 🔗 All Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/react/users/{id}` | Get user profile |
| GET | `/api/react/users/{id}/statistics` | Get user stats |
| PUT | `/api/react/users/{id}/profile` | Update profile |
| GET | `/api/react/users/{id}/library` | Get library IDs |
| GET | `/api/react/users/{id}/library/full` | Get full library |
| POST | `/api/react/users/{id}/library/{gameId}` | Add to library |
| DELETE | `/api/react/users/{id}/library/{gameId}` | Remove from library |
| GET | `/api/react/users/{id}/wishlist` | Get wishlist IDs |
| GET | `/api/react/users/{id}/wishlist/full` | Get full wishlist |
| POST | `/api/react/users/{id}/wishlist/{gameId}` | Add to wishlist |
| DELETE | `/api/react/users/{id}/wishlist/{gameId}` | Remove from wishlist |
| GET | `/api/react/users/{id}/friends` | Get friends |
| POST | `/api/react/users/{id}/friends/{friendId}` | Add friend |
| DELETE | `/api/react/users/{id}/friends/{friendId}` | Remove friend |
| GET | `/api/react/users/{id}/rewards` | Get rewards |
| GET | `/api/react/users/{id}/notifications` | Get notifications |
| GET | `/api/react/users/{id}/posts` | Get posts |

---

## 🐛 Common Issues

### ❌ Wrong URL
```javascript
// DON'T USE - This won't work!
fetch('/api/users/1')
```

### ✅ Correct URL
```javascript
// DO USE - This works with Docker Compose!
fetch('/api/react/users/1')
```

---

## 🎯 Response Examples

### User Object
```json
{
  "id": 1,
  "displayName": "JohnDoe",
  "displayImage": "/images/john.jpg",
  "level": "USER",
  "canSell": false,
  "gamesInLibrary": [1, 2, 3],
  "wishlist": [4, 5],
  "friends": [...],
  "rewards": [...],
  "notifications": [...]
}
```

### Statistics Object
```json
{
  "userId": 1,
  "displayName": "JohnDoe",
  "level": "USER",
  "totalGames": 5,
  "totalWishlist": 3,
  "totalFriends": 12,
  "totalRewards": 8,
  "totalPosts": 15,
  "unreadNotifications": 2
}
```

---

## 🔍 Testing

### Start Services
```bash
docker-compose up -d
```

### Test API
```bash
# Run test script
./test-user-api.sh

# Or manual test
curl http://localhost:8080/api/react/users/1
```

### Check Logs
```bash
docker-compose logs -f react-backend
docker-compose logs -f api-gateway
```

---

## 📚 Full Documentation

- **Setup Guide:** `USER_PROFILE_DOCKER_COMPOSE_SETUP.md`
- **API Reference:** `backend/React-spring-backend/USER_PROFILE_API_DOCUMENTATION.md`
- **Quick Start:** `REACT_USER_PROFILE_QUICKSTART.md`

---

**Remember:** Always use `/api/react/` prefix when running with Docker Compose! 🚀
