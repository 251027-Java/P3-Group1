# 🚀 React Backend - User Profile Quick Start (Kenneth's Task)

## ✅ What's Been Completed

Your task to "Load in User Profile Objects" for the React backend is complete! Here's what was built:

### Backend Components Created

1. **UserService.java** - Comprehensive service layer with 25+ methods for:
   - User profile management
   - Friends management (add/remove friends)
   - Games library management (add/remove games, get full game objects)
   - Wishlist management (add/remove games, get full game objects)
   - Rewards management (add/remove rewards)
   - Notifications management (add/remove/clear notifications)
   - Community posts retrieval
   - User statistics

2. **UserController.java** - REST API controller with 23 endpoints:
   - Profile operations (get by ID, get by name, update, statistics)
   - Friends operations (get, add, remove)
   - Library operations (get IDs, get full objects, add, remove)
   - Wishlist operations (get IDs, get full objects, add, remove)
   - Rewards operations (get, add, remove)
   - Notifications operations (get, add, clear, remove specific)
   - Community posts operations (get user's posts)

3. **Documentation**
   - Complete API documentation with all endpoints
   - Usage examples for each endpoint
   - Integration examples for team members
   - React frontend integration examples

---

## 📁 Files Created

```
backend/React-spring-backend/
└── src/main/java/com/example/React_spring_service/
    ├── Services/
    │   └── UserService.java                    ✅ NEW
    ├── Controller/
    │   └── UserController.java                 ✅ NEW
    └── USER_PROFILE_API_DOCUMENTATION.md      ✅ NEW
```

**Important:** The existing User entity was NOT modified (as requested). All functionality works with the existing entity structure.

---

## 🎯 Quick Test

### 1. Start the Backend

```bash
cd backend/React-spring-backend
./mvnw spring-boot:run
```

### 2. Test the Endpoints

**Get all users (from GlobalController):**
```bash
curl http://localhost:8080/api/users
```

**Get specific user:**
```bash
curl http://localhost:8080/api/users/1
```

**Get user statistics:**
```bash
curl http://localhost:8080/api/users/1/statistics
```

**Get user's games library:**
```bash
curl http://localhost:8080/api/users/1/library/full
```

**Get user's friends:**
```bash
curl http://localhost:8080/api/users/1/friends
```

---

## 📡 Available Endpoints Summary

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Profile** | `/api/users/{id}` | GET | Get user profile |
| | `/api/users/displayName/{name}` | GET | Get user by name |
| | `/api/users/{id}/profile` | PUT | Update profile |
| | `/api/users/{id}/statistics` | GET | Get user stats |
| **Friends** | `/api/users/{id}/friends` | GET | Get friends |
| | `/api/users/{id}/friends/{friendId}` | POST | Add friend |
| | `/api/users/{id}/friends/{friendId}` | DELETE | Remove friend |
| **Library** | `/api/users/{id}/library` | GET | Get library (IDs) |
| | `/api/users/{id}/library/full` | GET | Get library (full objects) |
| | `/api/users/{id}/library/{gameId}` | POST | Add to library |
| | `/api/users/{id}/library/{gameId}` | DELETE | Remove from library |
| **Wishlist** | `/api/users/{id}/wishlist` | GET | Get wishlist (IDs) |
| | `/api/users/{id}/wishlist/full` | GET | Get wishlist (full objects) |
| | `/api/users/{id}/wishlist/{gameId}` | POST | Add to wishlist |
| | `/api/users/{id}/wishlist/{gameId}` | DELETE | Remove from wishlist |
| **Rewards** | `/api/users/{id}/rewards` | GET | Get rewards |
| | `/api/users/{id}/rewards/{rewardId}` | POST | Add reward |
| | `/api/users/{id}/rewards/{rewardId}` | DELETE | Remove reward |
| **Notifications** | `/api/users/{id}/notifications` | GET | Get notifications |
| | `/api/users/{id}/notifications` | POST | Add notification |
| | `/api/users/{id}/notifications` | DELETE | Clear all |
| | `/api/users/{id}/notifications/{index}` | DELETE | Remove one |
| **Posts** | `/api/users/{id}/posts` | GET | Get user's posts |

---

## 🔥 Common Use Cases

### Use Case 1: Display User Profile

```javascript
// Fetch user data
const response = await fetch('/api/users/1');
const user = await response.json();

// Display in React component
return (
  <div>
    <img src={user.displayImage} alt={user.displayName} />
    <h1>{user.displayName}</h1>
    <p>Level: {user.level}</p>
    <p>Total Games: {user.gamesInLibrary.length}</p>
  </div>
);
```

### Use Case 2: Show User's Game Library

```javascript
// Get full game objects
const response = await fetch('/api/users/1/library/full');
const games = await response.json();

// Display games
games.map(game => (
  <GameCard 
    key={game.id}
    title={game.title}
    price={game.price}
    image={game.coverImage}
  />
));
```

### Use Case 3: Add Game to Library (After Purchase)

```javascript
// When user purchases a game
const addToLibrary = async (userId, gameId) => {
  const response = await fetch(`/api/users/${userId}/library/${gameId}`, {
    method: 'POST'
  });
  const result = await response.json();
  console.log(result.message); // "Game added to library successfully"
  
  // Update UI with new library
  return result.library;
};
```

### Use Case 4: Manage Wishlist

```javascript
// Add to wishlist
const addToWishlist = async (userId, gameId) => {
  await fetch(`/api/users/${userId}/wishlist/${gameId}`, {
    method: 'POST'
  });
};

// Remove from wishlist
const removeFromWishlist = async (userId, gameId) => {
  await fetch(`/api/users/${userId}/wishlist/${gameId}`, {
    method: 'DELETE'
  });
};

// Check if in wishlist
const checkWishlist = async (userId, gameId) => {
  const response = await fetch(`/api/users/${userId}/wishlist`);
  const wishlist = await response.json();
  return wishlist.includes(gameId);
};
```

### Use Case 5: Display User Statistics Dashboard

```javascript
const response = await fetch('/api/users/1/statistics');
const stats = await response.json();

return (
  <div className="stats-dashboard">
    <StatCard label="Games Owned" value={stats.totalGames} />
    <StatCard label="Wishlist" value={stats.totalWishlist} />
    <StatCard label="Friends" value={stats.totalFriends} />
    <StatCard label="Rewards" value={stats.totalRewards} />
    <StatCard label="Posts" value={stats.totalPosts} />
    <StatCard label="Notifications" value={stats.unreadNotifications} />
  </div>
);
```

---

## 🤝 Team Integration Guide

### For Brody (Dashboard)

```javascript
// Check if user owns a game before showing "Play" button
const userLibrary = await fetch(`/api/users/${userId}/library`).then(r => r.json());
const ownsGame = userLibrary.includes(gameId);

if (ownsGame) {
  return <button>Play Now</button>;
} else {
  return <button>Buy Now</button>;
}
```

### For Osi (Community)

```javascript
// Get user info to display with posts
const user = await fetch(`/api/users/${authorId}`).then(r => r.json());

// Get user's all posts
const posts = await fetch(`/api/users/${authorId}/posts`).then(r => r.json());
```

### For Omar (Tokens)

```javascript
// Award reward when user purchases tokens
await fetch(`/api/users/${userId}/rewards/${rewardId}`, {
  method: 'POST'
});

// Add notification about token purchase
await fetch(`/api/users/${userId}/notifications`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'token_purchase',
    message: 'You purchased 100 tokens!',
    timestamp: new Date().toISOString()
  })
});
```

### For Shara (Game Page)

```javascript
// Check if game is in user's library
const library = await fetch(`/api/users/${userId}/library`).then(r => r.json());
const ownGame = library.includes(gameId);

// Check if game is in wishlist
const wishlist = await fetch(`/api/users/${userId}/wishlist`).then(r => r.json());
const inWishlist = wishlist.includes(gameId);

// Toggle wishlist
if (inWishlist) {
  // Remove from wishlist
  await fetch(`/api/users/${userId}/wishlist/${gameId}`, { method: 'DELETE' });
} else {
  // Add to wishlist
  await fetch(`/api/users/${userId}/wishlist/${gameId}`, { method: 'POST' });
}
```

### For Fahad, Raman (Games)

```javascript
// After game purchase, add to user's library
await fetch(`/api/users/${userId}/library/${gameId}`, {
  method: 'POST'
});
```

---

## 💡 React Hook Example

Create a custom hook for user data:

```typescript
// hooks/useUser.ts
import { useState, useEffect } from 'react';

export const useUser = (userId: number) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  const updateProfile = async (updates) => {
    const response = await fetch(`/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const updatedUser = await response.json();
    setUser(updatedUser);
    return updatedUser;
  };

  const addGameToLibrary = async (gameId) => {
    await fetch(`/api/users/${userId}/library/${gameId}`, {
      method: 'POST'
    });
    // Refresh user data
    const response = await fetch(`/api/users/${userId}`);
    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  return {
    user,
    loading,
    error,
    updateProfile,
    addGameToLibrary
  };
};

// Usage in component:
const UserProfile = ({ userId }) => {
  const { user, loading, updateProfile } = useUser(userId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.displayName}</h1>
      <p>Games: {user.gamesInLibrary.length}</p>
      <button onClick={() => updateProfile({ displayName: 'NewName' })}>
        Update Name
      </button>
    </div>
  );
};
```

---

## 🎨 React Component Example

```typescript
// components/UserProfile.tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  displayName: string;
  displayImage: string;
  level: string;
  canSell: boolean;
  gamesInLibrary: number[];
  wishlist: number[];
  friends: any[];
  rewards: any[];
}

export const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Fetch user data
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);

    // Fetch statistics
    fetch(`/api/users/${userId}/statistics`)
      .then(res => res.json())
      .then(setStats);
  }, [userId]);

  if (!user || !stats) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.displayImage} alt={user.displayName} />
        <h1>{user.displayName}</h1>
        <span className="badge">{user.level}</span>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <span className="stat-value">{stats.totalGames}</span>
          <span className="stat-label">Games</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.totalFriends}</span>
          <span className="stat-label">Friends</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.totalRewards}</span>
          <span className="stat-label">Rewards</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.totalPosts}</span>
          <span className="stat-label">Posts</span>
        </div>
      </div>
    </div>
  );
};
```

---

## ✅ Task Completion Checklist

- ✅ UserService created with all profile management methods
- ✅ UserController created with 23 REST endpoints
- ✅ Friends management (add/remove friends)
- ✅ Games library management (IDs and full objects)
- ✅ Wishlist management (IDs and full objects)
- ✅ Rewards management
- ✅ Notifications management
- ✅ User statistics endpoint
- ✅ Community posts retrieval
- ✅ Comprehensive API documentation
- ✅ Usage examples for team integration
- ✅ React integration examples
- ✅ No linter errors
- ✅ No modifications to User entity (as requested)

---

## 📖 Full Documentation

For complete API documentation with all endpoints, request/response examples, and integration guides, see:

**`backend/React-spring-backend/USER_PROFILE_API_DOCUMENTATION.md`**

---

## 🎉 You're Done, Kenneth!

Your task to "Load in User Profile Objects" is **100% complete**! 

All user profile data is now accessible through:
1. The UserService (for internal backend use)
2. The REST API (for frontend/external use)

Your teammates can now:
- Fetch user profiles
- Manage user libraries and wishlists
- Handle friends and rewards
- Work with user notifications
- Get user statistics

**Great job! 🚀**

---

**Task:** Load in User Profile Objects  
**Assignee:** Kenneth  
**Status:** ✅ COMPLETE  
**Date:** January 20, 2026
