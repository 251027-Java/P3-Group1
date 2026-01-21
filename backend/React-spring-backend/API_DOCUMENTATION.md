# Game API Documentation

## Base URL
```
http://localhost:8080/api
```

## Entities Overview

### GameEntity
- Represents playable games in the system (Bubble Trouble, Flappy Bird, etc.)
- Fields: id, name, description, createdAt

### GameScore
- Represents individual game scores submitted by users
- Fields: id, userId, gameId, score, level, timestamp

---

## Game Endpoints

### 1. Get All Games
```http
GET /api/games
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Bubble Trouble",
    "description": "Pop bubbles without getting hit",
    "createdAt": "2025-01-21T10:00:00"
  }
]
```

### 2. Get Game by ID
```http
GET /api/games/{id}
```

**Response:**
```json
{
  "id": 1,
  "name": "Bubble Trouble",
  "description": "Pop bubbles without getting hit",
  "createdAt": "2025-01-21T10:00:00"
}
```

### 3. Get Game by Name
```http
GET /api/games/name/{name}
```

**Example:**
```http
GET /api/games/name/Bubble%20Trouble
```

### 4. Create Game
```http
POST /api/games
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Bubble Trouble",
  "description": "Pop bubbles without getting hit"
}
```

### 5. Update Game
```http
PUT /api/games/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### 6. Delete Game
```http
DELETE /api/games/{id}
```

---

## Game Score Endpoints

### 1. Submit Score
```http
POST /api/game-scores
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 1,
  "gameId": 1,
  "score": 1500,
  "level": 7
}
```

**Response:**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "displayName": "Player1"
  },
  "game": {
    "id": 1,
    "name": "Bubble Trouble"
  },
  "score": 1500,
  "level": 7,
  "timestamp": "2025-01-21T14:30:00"
}
```

### 2. Get Leaderboard
```http
GET /api/game-scores/leaderboard/{gameId}?limit=10
```

**Response:**
```json
[
  {
    "rank": 1,
    "displayName": "Player1",
    "score": 2000,
    "level": 10,
    "timestamp": "2025-01-21T14:30:00"
  },
  {
    "rank": 2,
    "displayName": "Player2",
    "score": 1500,
    "level": 8,
    "timestamp": "2025-01-21T13:15:00"
  }
]
```

### 3. Get User's Best Score for a Game
```http
GET /api/game-scores/user/{userId}/game/{gameId}/best
```

**Example:**
```http
GET /api/game-scores/user/1/game/1/best
```

**Response:**
```json
{
  "id": 5,
  "score": 2000,
  "level": 10,
  "timestamp": "2025-01-21T14:30:00"
}
```

### 4. Get All User Scores for a Game
```http
GET /api/game-scores/user/{userId}/game/{gameId}
```

**Response:**
```json
[
  {
    "id": 5,
    "score": 2000,
    "level": 10,
    "timestamp": "2025-01-21T14:30:00"
  },
  {
    "id": 3,
    "score": 1500,
    "level": 8,
    "timestamp": "2025-01-21T12:00:00"
  }
]
```

### 5. Get All Scores for a User
```http
GET /api/game-scores/user/{userId}
```

**Response:**
```json
[
  {
    "id": 5,
    "game": {
      "id": 1,
      "name": "Bubble Trouble"
    },
    "score": 2000,
    "level": 10,
    "timestamp": "2025-01-21T14:30:00"
  },
  {
    "id": 7,
    "game": {
      "id": 2,
      "name": "Flappy Bird"
    },
    "score": 45,
    "level": null,
    "timestamp": "2025-01-21T15:00:00"
  }
]
```

### 6. Get All Scores for a Game
```http
GET /api/game-scores/game/{gameId}
```

**Response:**
```json
[
  {
    "id": 5,
    "user": {
      "id": 1,
      "displayName": "Player1"
    },
    "score": 2000,
    "level": 10,
    "timestamp": "2025-01-21T14:30:00"
  }
]
```

### 7. Delete Score
```http
DELETE /api/game-scores/{scoreId}
```

---

## Usage Examples

### JavaScript/React Example

```javascript
// Submit a score
const submitScore = async (userId, gameId, score, level) => {
  const response = await fetch('http://localhost:8080/api/game-scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      gameId: gameId,
      score: score,
      level: level
    })
  });
  
  return response.json();
};

// Get leaderboard
const getLeaderboard = async (gameId, limit = 10) => {
  const response = await fetch(
    `http://localhost:8080/api/game-scores/leaderboard/${gameId}?limit=${limit}`
  );
  return response.json();
};

// Get user's best score
const getUserBestScore = async (userId, gameId) => {
  const response = await fetch(
    `http://localhost:8080/api/game-scores/user/${userId}/game/${gameId}/best`
  );
  
  if (response.ok) {
    return response.json();
  }
  return null;
};
```

---

## Error Responses

### 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request data"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

---

## Database Schema

### games table
```sql
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000),
    created_at TIMESTAMP
);
```

### game_scores table
```sql
CREATE TABLE game_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    score INTEGER NOT NULL,
    level INTEGER,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);
```

---

## Setup Instructions

### 1. Initialize Games in Database

```sql
INSERT INTO games (name, description, created_at) VALUES
('Bubble Trouble', 'Pop all the bubbles without getting hit', NOW()),
('Flappy Bird', 'Fly through pipes without crashing', NOW());
```

### 2. Test with cURL

```bash
# Create a game
curl -X POST http://localhost:8080/api/games \
  -H "Content-Type: application/json" \
  -d '{"name": "Bubble Trouble", "description": "Pop bubbles game"}'

# Submit a score
curl -X POST http://localhost:8080/api/game-scores \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameId": 1, "score": 1500, "level": 7}'

# Get leaderboard
curl http://localhost:8080/api/game-scores/leaderboard/1?limit=10
```

---

## Notes

- All endpoints support CORS with `origins = "*"` for development
- Timestamps are in ISO 8601 format
- Score ordering is descending (highest first)
- Leaderboard uses score as primary sort, timestamp as tiebreaker
- Level field is optional (can be null for games like Flappy Bird)

---

## Common Issues & Solutions

### Issue: 404 on all endpoints
**Solution:** Check that Spring Boot application is running on port 8080

### Issue: User not found
**Solution:** Ensure user exists in database before submitting scores

### Issue: Game not found
**Solution:** Create game entry in database first using POST /api/games

### Issue: CORS errors
**Solution:** Already configured with `@CrossOrigin(origins = "*")`, but check browser console

---

## Future Enhancements

- Add authentication/authorization
- Add score validation
- Add rate limiting
- Add pagination for large result sets
- Add score statistics (average, median, etc.)
- Add achievement tracking
- Add replay data storage
