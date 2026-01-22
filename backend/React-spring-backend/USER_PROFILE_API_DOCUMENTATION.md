# React Backend - User Profile API Documentation

## Overview

This document describes the User Profile management system for the React backend service. The system provides comprehensive user profile functionality including friends management, games library, wishlist, rewards, and notifications.

---

## Base URLs

**Through API Gateway (Production/Docker):**
```
http://localhost:8080/api/react/users
```

**Direct to React Backend (Development):**
```
http://localhost:8081/users
```

**Note:** When running with docker-compose, always use the gateway URL (`/api/react/users`). The gateway routes requests to the React backend service.

---

## User Entity Structure

The User entity includes the following fields:

```java
{
  "id": Long,                          // Primary key
  "displayName": String,               // User's display name (required)
  "displayImage": String,              // Path/URL to profile image
  "level": UserLevel,                  // Enum: DEVELOPER or USER
  "canSell": boolean,                  // Whether user can sell games
  "rewards": Set<Reward>,              // User's earned rewards
  "friends": Set<User>,                // User's friends
  "gamesInLibrary": List<Long>,        // IDs of owned games
  "wishlist": List<Long>,              // IDs of wishlisted games
  "notifications": List<Map>,          // User notifications
  "communityPosts": List<CommunityPost> // User's community posts
}
```

---

## API Endpoints

### 1. User Profile Operations

#### Get User by ID
```
GET /api/react/users/{id}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "displayName": "JohnDoe",
  "displayImage": "/images/profiles/john.jpg",
  "level": "USER",
  "canSell": false,
  "rewards": [...],
  "friends": [...],
  "gamesInLibrary": [1, 2, 3],
  "wishlist": [4, 5],
  "notifications": [...],
  "communityPosts": [...]
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found with id: 1"
}
```

---

#### Get User by Display Name
```
GET /api/react/users/displayName/{displayName}
```

**Example:**
```
GET /api/react/users/displayName/JohnDoe
```

**Response:** Same as Get User by ID

---

#### Update User Profile
```
PUT /api/react/users/{id}/profile
```

**Request Body:**
```json
{
  "displayName": "NewDisplayName",
  "displayImage": "/images/profiles/new.jpg",
  "level": "DEVELOPER",
  "canSell": true
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response (200 OK):**
```json
{
  "id": 1,
  "displayName": "NewDisplayName",
  "displayImage": "/images/profiles/new.jpg",
  "level": "DEVELOPER",
  "canSell": true,
  ...
}
```

---

#### Get User Statistics
```
GET /api/react/users/{id}/statistics
```

**Response (200 OK):**
```json
{
  "userId": 1,
  "displayName": "JohnDoe",
  "level": "USER",
  "canSell": false,
  "totalGames": 5,
  "totalWishlist": 3,
  "totalFriends": 12,
  "totalRewards": 8,
  "totalPosts": 15,
  "unreadNotifications": 2
}
```

---

### 2. Friends Management

#### Get User's Friends
```
GET /api/react/users/{id}/friends
```

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "displayName": "JaneDoe",
    "displayImage": "/images/profiles/jane.jpg",
    "level": "DEVELOPER",
    ...
  },
  {
    "id": 3,
    "displayName": "BobSmith",
    "displayImage": "/images/profiles/bob.jpg",
    "level": "USER",
    ...
  }
]
```

---

#### Add Friend
```
POST /api/react/users/{id}/friends/{friendId}
```

**Example:**
```
POST /api/react/users/1/friends/2
```

**Response (200 OK):**
```json
{
  "message": "Friend added successfully",
  "user": {
    "id": 1,
    "displayName": "JohnDoe",
    "friends": [...],
    ...
  }
}
```

---

#### Remove Friend
```
DELETE /api/react/users/{id}/friends/{friendId}
```

**Example:**
```
DELETE /api/react/users/1/friends/2
```

**Response (200 OK):**
```json
{
  "message": "Friend removed successfully",
  "user": {
    "id": 1,
    "displayName": "JohnDoe",
    "friends": [...],
    ...
  }
}
```

---

### 3. Games Library Management

#### Get Games Library (IDs Only)
```
GET /api/react/users/{id}/library
```

**Response (200 OK):**
```json
[1, 2, 3, 5, 7]
```

---

#### Get Games Library (Full Game Objects)
```
GET /api/react/users/{id}/library/full
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Epic Adventure",
    "price": 29.99,
    "developer": {...},
    ...
  },
  {
    "id": 2,
    "title": "Space Shooter",
    "price": 19.99,
    "developer": {...},
    ...
  }
]
```

---

#### Add Game to Library
```
POST /api/react/users/{id}/library/{gameId}
```

**Example:**
```
POST /api/react/users/1/library/5
```

**Response (200 OK):**
```json
{
  "message": "Game added to library successfully",
  "library": [1, 2, 3, 5]
}
```

---

#### Remove Game from Library
```
DELETE /api/react/users/{id}/library/{gameId}
```

**Example:**
```
DELETE /api/react/users/1/library/5
```

**Response (200 OK):**
```json
{
  "message": "Game removed from library successfully",
  "library": [1, 2, 3]
}
```

---

### 4. Wishlist Management

#### Get Wishlist (IDs Only)
```
GET /api/react/users/{id}/wishlist
```

**Response (200 OK):**
```json
[4, 5, 6]
```

---

#### Get Wishlist (Full Game Objects)
```
GET /api/react/users/{id}/wishlist/full
```

**Response (200 OK):**
```json
[
  {
    "id": 4,
    "title": "Mystery Quest",
    "price": 39.99,
    ...
  }
]
```

---

#### Add Game to Wishlist
```
POST /api/react/users/{id}/wishlist/{gameId}
```

**Response (200 OK):**
```json
{
  "message": "Game added to wishlist successfully",
  "wishlist": [4, 5, 6, 7]
}
```

---

#### Remove Game from Wishlist
```
DELETE /api/react/users/{id}/wishlist/{gameId}
```

**Response (200 OK):**
```json
{
  "message": "Game removed from wishlist successfully",
  "wishlist": [4, 5, 6]
}
```

---

### 5. Rewards Management

#### Get User's Rewards
```
GET /api/react/users/{id}/rewards
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "First Purchase",
    "description": "Made your first game purchase",
    "category": "ACHIEVEMENT",
    ...
  },
  {
    "id": 2,
    "name": "Social Butterfly",
    "description": "Added 10 friends",
    "category": "SOCIAL",
    ...
  }
]
```

---

#### Add Reward to User
```
POST /api/users/{id}/rewards/{rewardId}
```

**Response (200 OK):**
```json
{
  "message": "Reward added successfully",
  "rewards": [...]
}
```

---

#### Remove Reward from User
```
DELETE /api/react/users/{id}/rewards/{rewardId}
```

**Response (200 OK):**
```json
{
  "message": "Reward removed successfully",
  "rewards": [...]
}
```

---

### 6. Notifications Management

#### Get User's Notifications
```
GET /api/react/users/{id}/notifications
```

**Response (200 OK):**
```json
[
  {
    "type": "friend_request",
    "message": "JaneDoe sent you a friend request",
    "timestamp": "2026-01-20T10:30:00",
    "read": false
  },
  {
    "type": "game_sale",
    "message": "Epic Adventure is on sale!",
    "timestamp": "2026-01-20T09:15:00",
    "read": false
  }
]
```

---

#### Add Notification
```
POST /api/users/{id}/notifications
```

**Request Body:**
```json
{
  "type": "achievement",
  "message": "You earned a new achievement!",
  "timestamp": "2026-01-20T11:00:00",
  "read": false
}
```

**Response (200 OK):**
```json
{
  "message": "Notification added successfully",
  "notifications": [...]
}
```

---

#### Clear All Notifications
```
DELETE /api/react/users/{id}/notifications
```

**Response (200 OK):**
```json
{
  "message": "All notifications cleared successfully"
}
```

---

#### Remove Specific Notification
```
DELETE /api/users/{id}/notifications/{index}
```

**Example:**
```
DELETE /api/users/1/notifications/0
```
(Removes the first notification in the list)

**Response (200 OK):**
```json
{
  "message": "Notification removed successfully",
  "notifications": [...]
}
```

---

### 7. Community Posts

#### Get User's Community Posts
```
GET /api/react/users/{id}/posts
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "My thoughts on Epic Adventure",
    "content": "This game is amazing!",
    "postType": "REVIEW",
    "author": {...},
    "dateCreated": "2026-01-20T10:00:00",
    ...
  }
]
```

---

## Usage Examples

### Example 1: Get User Profile and Statistics

```javascript
// Fetch user profile (through gateway)
const userResponse = await fetch('http://localhost:8080/api/react/users/1');
const user = await userResponse.json();

// Fetch user statistics
const statsResponse = await fetch('http://localhost:8080/api/react/users/1/statistics');
const stats = await statsResponse.json();

console.log(`${user.displayName} has ${stats.totalGames} games`);
```

---

### Example 2: Update User Profile

```javascript
const updateData = {
  displayName: "NewUsername",
  level: "DEVELOPER",
  canSell: true
};

const response = await fetch('http://localhost:8080/api/react/users/1/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
});

const updatedUser = await response.json();
```

---

### Example 3: Add Game to Library

```javascript
const response = await fetch('http://localhost:8080/api/react/users/1/library/5', {
  method: 'POST'
});

const result = await response.json();
console.log(result.message); // "Game added to library successfully"
```

---

### Example 4: Manage Friends

```javascript
// Add friend
await fetch('http://localhost:8080/api/react/users/1/friends/2', {
  method: 'POST'
});

// Get all friends
const friendsResponse = await fetch('http://localhost:8080/api/react/users/1/friends');
const friends = await friendsResponse.json();

// Remove friend
await fetch('http://localhost:8080/api/react/users/1/friends/2', {
  method: 'DELETE'
});
```

---

### Example 5: Get Full Library with Game Details

```javascript
// Get just game IDs
const idsResponse = await fetch('http://localhost:8080/api/react/users/1/library');
const gameIds = await idsResponse.json(); // [1, 2, 3]

// Get full game objects
const fullResponse = await fetch('http://localhost:8080/api/react/users/1/library/full');
const games = await fullResponse.json(); // [{id: 1, title: "...", ...}, ...]
```

---

## Error Handling

All endpoints return consistent error responses:

**404 Not Found:**
```json
{
  "error": "User not found with id: 1"
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid request: <specific error message>"
}
```

**500 Internal Server Error:**
```json
{
  "error": "<error message>"
}
```

---

## Best Practices

1. **Always check response status codes** before processing data
2. **Use the full endpoints** (`/library/full`, `/wishlist/full`) when you need game details
3. **Use the ID-only endpoints** when you just need to check ownership or counts
4. **Handle errors gracefully** - show user-friendly messages
5. **Cache user data** on the frontend to reduce API calls
6. **Update local state** after successful mutations

---

## Integration with Other Services

### Games Dashboard (Brody)
```javascript
// Check if user owns a game
const library = await fetch(`/api/react/users/${userId}/library`).then(r => r.json());
const ownsGame = library.includes(gameId);
```

### Community (Osi)
```javascript
// Get user info for post author
const user = await fetch(`/api/react/users/${authorId}`).then(r => r.json());
// Display: user.displayName, user.displayImage
```

### Token Store (Omar)
```javascript
// Award reward when user purchases tokens
await fetch(`/api/react/users/${userId}/rewards/${rewardId}`, {
  method: 'POST'
});
```

### Game Page (Shara)
```javascript
// Add game to library after purchase
await fetch(`/api/react/users/${userId}/library/${gameId}`, {
  method: 'POST'
});

// Check if game is in wishlist
const wishlist = await fetch(`/api/react/users/${userId}/wishlist`).then(r => r.json());
const isWishlisted = wishlist.includes(gameId);
```

---

## React Frontend Integration Example

```typescript
// userApi.ts
export const userApi = {
  getUser: async (userId: number) => {
    const response = await fetch(`/api/react/users/${userId}`);
    return response.json();
  },

  updateProfile: async (userId: number, updates: any) => {
    const response = await fetch(`/api/react/users/${userId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  getUserLibrary: async (userId: number) => {
    const response = await fetch(`/api/react/users/${userId}/library/full`);
    return response.json();
  },

  addToLibrary: async (userId: number, gameId: number) => {
    const response = await fetch(`/api/react/users/${userId}/library/${gameId}`, {
      method: 'POST'
    });
    return response.json();
  },

  getFriends: async (userId: number) => {
    const response = await fetch(`/api/react/users/${userId}/friends`);
    return response.json();
  }
};
```

---

## Testing the API

### Using cURL

```bash
# Get user (through gateway)
curl http://localhost:8080/api/react/users/1

# Update profile
curl -X PUT http://localhost:8080/api/react/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{"displayName":"NewName","canSell":true}'

# Add friend
curl -X POST http://localhost:8080/api/react/users/1/friends/2

# Get library
curl http://localhost:8080/api/react/users/1/library/full

# Add to wishlist
curl -X POST http://localhost:8080/api/react/users/1/wishlist/5
```

---

## Notes

- All endpoints support CORS for development (`@CrossOrigin(origins = "*")`)
- The User entity uses Lombok annotations for getters/setters
- Relationships are lazily loaded for performance
- The service layer handles all business logic and validation
- All modifications are transactional

---

**Last Updated:** January 20, 2026  
**Author:** Kenneth (User Profile Objects Task)
