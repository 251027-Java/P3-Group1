# GameHub Backend

Full-stack game hosting platform backend with microservices architecture.

## Services

| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| User Service | 8081 | User management, auth | userdb |
| Game Service | 8082 | Game catalog, tracking | gamedb |
| Eureka Server | 8761 | Service discovery | - |
| API Gateway | 8080 | Request routing | - |

## Tech Stack

Spring Boot 3.2.1 • Java 17 • PostgreSQL • Kafka • Docker • Maven

## Architecture

```
┌─────────────┐
│   Clients   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  API Gateway    │
│   (Port 8080)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ User  │ │ Game  │
│Service│ │Service│
│ 8081  │ │ 8082  │
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│Eureka │ │ Kafka │
└───────┘ └───────┘
    │         │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│UserDB  │ │GameDB  │
│5432    │ │5433    │
└────────┘ └────────┘
```

## Quick Start

```bash
cd backend
docker-compose up -d
```

**Access:**
- Eureka: http://localhost:8761
- User API: http://localhost:8081/swagger-ui.html
- Game API: http://localhost:8082/swagger-ui.html
- Gateway: http://localhost:8080

**Logs:** `docker-compose logs -f`  
**Stop:** `docker-compose down`

## Kafka Topics

- `user-events`, `game-events` - Inter-service communication
- `user-service-logs`, `game-service-logs` - Centralized logging

## Databases

**userdb:** users, user_preferences  
**gamedb:** games, game_tags

## Testing

```bash
cd user-service && mvn test
cd game-service && mvn test
```

Coverage: 60%+ (JaCoCo reports)

## Health Checks

- `/actuator/health` on all services
- Check via Eureka dashboard

## Common Issues

**Port conflicts:** `docker-compose restart [service]`  
**Service won't start:** Check logs `docker-compose logs [service]`  
**Clean restart:** `docker-compose down -v && docker-compose up -d --build`

## Project Status

✅ Complete: User Service, Game Service, Kafka integration, Docker setup  
📋 Needed: 3rd microservice, JWT auth, Many-to-Many DB relationships

## Documentation

- [KENNETH_SUMMARY.md](./KENNETH_SUMMARY.md) - Quick overview
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture diagrams
- [user-service/README.md](./user-service/README.md) - User Service details
- [game-service/README.md](./game-service/README.md) - Game Service details

---

*Built with Claude AI assistance • Reviewed by Kenneth*
