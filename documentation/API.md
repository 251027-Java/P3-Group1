# API Documentation

Complete API reference for all GameHub Platform microservices.

## Base URLs

Development: API Gateway `http://localhost:8080`, React Service `http://localhost:8081`, Angular Service `http://localhost:8082`, Eureka `http://localhost:8761`

Production: API Gateway `https://api.gamehub.example.com`, Swagger UI at `/swagger-ui.html`

## API Versioning

Current: `/api/v1/...`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Obtaining a Token

`POST /api/angular/auth/login` with `{"username": "...", "password": "..."}` returns JWT token and user info.

## React Spring Service API

Base path through Gateway: `/api/...`  
Direct access: `http://localhost:8081/...`

### User Profile Endpoints

- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/displayName/{displayName}` - Get user by display name
- `PUT /api/users/{id}/profile` - Update user profile (body: displayName, displayImage, level, canSell)
- `GET /api/users/{id}/statistics` - Get user statistics

### Friends Management

- `GET /api/users/{id}/friends` - Get user's friends
- `POST /api/users/{id}/friends/{friendId}` - Add friend
- `DELETE /api/users/{id}/friends/{friendId}` - Remove friend

### Games Library Management

- `GET /api/users/{id}/library` - Get library (IDs only)
- `GET /api/users/{id}/library/full` - Get library (full game objects)
- `POST /api/users/{id}/library/{gameId}` - Add game to library
- `DELETE /api/users/{id}/library/{gameId}` - Remove game from library

### Wishlist Management

- `GET /api/users/{id}/wishlist` - Get wishlist (IDs only)
- `GET /api/users/{id}/wishlist/full` - Get wishlist (full objects)
- `POST /api/users/{id}/wishlist/{gameId}` - Add to wishlist
- `DELETE /api/users/{id}/wishlist/{gameId}` - Remove from wishlist

### Rewards Management

- `GET /api/users/{id}/rewards` - Get user's rewards
- `POST /api/users/{id}/rewards/{rewardId}` - Add reward
- `DELETE /api/users/{id}/rewards/{rewardId}` - Remove reward

### Notifications Management

- `GET /api/users/{id}/notifications` - Get notifications
- `POST /api/users/{id}/notifications` - Add notification (body: type, message, timestamp, read)
- `DELETE /api/users/{id}/notifications` - Clear all notifications
- `DELETE /api/users/{id}/notifications/{index}` - Remove specific notification

### Game Management

- `GET /api/games` - Get all games (query: page, size, sort)
- `GET /api/games/{id}` - Get game by ID
- `POST /api/games` - Create game
- `PUT /api/games/{id}` - Update game
- `DELETE /api/games/{id}` - Delete game

### Community Endpoints

- `GET /api/community/posts` - Get all posts
- `GET /api/community/posts/{id}` - Get post by ID
- `POST /api/community/posts` - Create post (body: title, content, postType, authorId, gameId)
- `PUT /api/community/posts/{id}` - Update post
- `DELETE /api/community/posts/{id}` - Delete post
- `GET /api/community/posts/{postId}/comments` - Get comments
- `POST /api/community/posts/{postId}/comments` - Add comment (body: content, authorId)

### Reviews Endpoints

- `GET /api/games/{gameId}/reviews` - Get reviews for game
- `POST /api/games/{gameId}/reviews` - Create review (body: rating, comment, userId, gameId)

## Angular Spring Service API

Base path through Gateway: `/api/angular/...`  
Direct access: `http://localhost:8082/...`

### Authentication Endpoints

- `POST /api/angular/auth/register` - Register user (body: username, email, password)
- `POST /api/angular/auth/login` - Login (body: username, password) returns JWT token
- `GET /api/angular/auth/validate` - Validate token (header: Authorization Bearer)
- `POST /api/angular/auth/logout` - Logout

### User Management

- `GET /api/angular/users/{id}` - Get user by ID
- `PUT /api/angular/users/{id}` - Update user (body: email, avatarUrl)

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- General endpoints: 100 requests per minute per user
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination

Query parameters: `page` (0-indexed, default: 0), `size` (default: 20, max: 100), `sort` (e.g., `name,asc`)

## Filtering and Search

Examples:
- `GET /api/games?developer=GameStudio`
- `GET /api/users?displayName=John`

## Swagger Documentation

- React Service: `http://localhost:8081/swagger-ui.html`
- Angular Service: `http://localhost:8082/swagger-ui.html`


## API Changelog

### v1.0.0
- User profile management
- Game management
- Community features
- Authentication