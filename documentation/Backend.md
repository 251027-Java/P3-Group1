# Backend Services Documentation

Complete documentation for GameHub Platform microservices.

## Overview

The backend consists of multiple Spring Boot microservices, each handling specific business domains. Services communicate via REST APIs, Kafka messaging, and service discovery through Eureka.

## Architecture

### Service Architecture

```
┌─────────────────┐
│  API Gateway     │ (Port 8080)
│  Spring Cloud    │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  Eureka Server   │ (Port 8761)
│  Service Discovery│
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ React   │ │ Angular │
│ Service │ │ Service │
│ 8081    │ │ 8082    │
└─────────┘ └─────────┘
```

## React Spring Service

### Overview

**Port**: 8081  
**Database**: `fleet_platform` (PostgreSQL)  
**Purpose**: User profiles, games, community, rewards

### Domain Entities

- **User**: id, displayName, displayImage, level, canSell, rewards (ManyToMany), friends (ManyToMany), gamesInLibrary (JSON), wishlist (JSON), notifications (JSON), communityPosts (OneToMany)
- **Game**: id, name, dateReleased, rating, developer, publisher, size, profileImage, backgroundImage, price, salePercent, onSale, tags (JSON), developerLogs (JSON), rewards (JSON), reviews (OneToMany)
- **Reward**: id, title, costInCoins, category, description, discountPercent, owners (ManyToMany)
- **CommunityPost**: id, title, content, postType, authorId, gameId, dateCreated, dateUpdated, comments (OneToMany)

### Controllers

- **UserController** (`/api/users`): `GET /{id}`, `PUT /{id}/profile`, `GET /{id}/friends`, `POST /{id}/friends/{friendId}`
- **GameController** (`/api/games`): `GET` (paginated), `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}`

### Services

- **UserService**: `getUserById()`, `updateProfile()`, `addFriend()`
- **GameService**: `getGames()`, `createGame()`, `purchaseGame()` (publishes Kafka event)

### Kafka Integration

- **Producer**: `sendUserUpdateEvent()`, `sendGamePurchasedEvent()` - sends to `user-events` and `game-events` topics
- **Consumer**: Configured with group ID `user-update-group`, bootstrap server `localhost:9092`

### Exception Handling

Global exception handler with `@RestControllerAdvice` handles `UserNotFoundException` (404) and `ValidationException` (400).

## Angular Spring Service

### Overview

**Port**: 8082  
**Database**: `fleet2` (PostgreSQL)  
**Purpose**: Authentication and user management

### Domain Entities

- **User**: id, username (unique), password (BCrypt hashed), email, avatarUrl, enabled

### Controllers

- **AuthController** (`/api/angular/auth`): `POST /register`, `POST /login`, `GET /validate`

### Services

- **AuthService**: `register()` (hashes password with BCrypt), `authenticate()` (validates credentials, generates JWT)
- **JwtUtils**: `generateToken()` (HS512, includes userId and username), `validateToken()`

## API Gateway

### Overview

**Port**: 8080  
**Framework**: Spring Cloud Gateway  
**Purpose**: Request routing, load balancing, authentication

### Route Configuration

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: angular-service
          uri: lb://ANGULAR-SPRING-SERVICE
          predicates:
            - Path=/api/angular/**
          filters:
            - RewritePath=/api/angular/(?<segment>.*), /${segment}
        
        - id: react-service
          uri: lb://REACT-SPRING-SERVICE
          predicates:
            - Path=/api/**
```

### Filters

Authentication filter validates JWT tokens for protected routes, returns 401 if invalid.

## Eureka Server

### Overview

**Port**: 8761  
**Purpose**: Service discovery and registration

### Configuration

```properties
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

### Service Registration

Services automatically register with Eureka:

```properties
eureka.client.service-url.defaultZone=http://eureka-server:8761/eureka
eureka.instance.prefer-ip-address=true
```

## Testing

Target: 60%+ line coverage. Run tests with `./mvnw test` and generate coverage reports with `./mvnw jacoco:report`.

## Logging

Logback configuration with console and file appenders. File logs at `/var/log/react-service/application.log` with daily rotation, 30-day retention. Structured logging with SLF4J.

## Health Checks

All services expose `/actuator/health` endpoints.

## Configuration Management

### Application Properties

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/fleet_platform
spring.datasource.username=dev_user
spring.datasource.password=dev_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Kafka
spring.kafka.bootstrap-servers=localhost:9092

# Eureka
eureka.client.service-url.defaultZone=http://eureka-server:8761/eureka
```

### Environment-Specific Configuration

Use profiles:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```