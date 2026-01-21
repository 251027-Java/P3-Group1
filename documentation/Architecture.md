# Architecture Overview

## System Architecture

Microservices backend with micro-frontend architecture. Independent development, deployment, and scaling.

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browsers                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Micro-Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Root Config  │  │ React MFE    │  │ Angular MFE  │          │
│  │ (Single-SPA) │  │ (Port 3000)  │  │ (Port 4200)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│              Spring Cloud Gateway (Port 8080)                    │
│              - Request Routing                                   │
│              - Load Balancing                                   │
│              - Authentication/Authorization                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Service Discovery                             │
│              Netflix Eureka Server (Port 8761)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  React Service  │ │ Angular Service │ │  [Future Service]│
│   (Port 8081)    │ │   (Port 8082)  │ │                 │
│                 │ │                 │ │                 │
│ - User Profile  │ │ - Authentication│ │                 │
│ - Games Library │ │ - User Mgmt     │ │                 │
│ - Community     │ │                 │ │                 │
│ - Rewards       │ │                 │ │                 │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Message Broker                                │
│              Apache Kafka (Port 9092)                            │
│              - Event-Driven Communication                        │
│              - Inter-Service Messaging                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  PostgreSQL     │ │  PostgreSQL     │ │  PostgreSQL     │
│  (React DB)     │ │  (Angular DB)   │ │  (Future DB)    │
│  Port 5432      │ │  Port 5433      │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Microservices Architecture

### Backend Services

#### 1. React Spring Service (Port 8081)
User profiles, game management, community features. Database: `fleet_platform` (PostgreSQL 5432). Entities: User, Game, Reward, CommunityPost, Review, Comment, CoinTransaction.

#### 2. Angular Spring Service (Port 8082)
Authentication and user management. Database: `fleet2` (PostgreSQL 5433). Entity: User (authentication-focused).

#### 3. API Gateway (Port 8080)
Centralized entry point. Routes: `/api/angular/**` → Angular Service, `/api/**` → React Service. Load balancing via Eureka.

#### 4. Eureka Server (Port 8761)
Service discovery and registration. Automatic service registration, health monitoring, load balancing support.

## Micro-Frontend Architecture

### Frontend Structure

#### Root Config (Single-SPA Shell)
Application shell at `frontend/shell/` that loads and coordinates child applications.

#### React Micro-Frontend (Port 3000)
React 19, TypeScript, Vite, Tailwind CSS. Main game platform interface: games dashboard, profiles, cart, wishlist, community, user profile, rewards, token store, game upload.

#### Angular Micro-Frontend (Port 4200)
Angular 21, TypeScript, Tailwind CSS. Authentication and account management: login, registration, landing page.

### Inter-MFE Communication

Custom Events, Shared State utility modules, URL-based routing via Single-SPA.

## Infrastructure Services

### Kafka
- **Port**: 9092
- **Topics**: `user-events`, `game-events`
- **Consumer Group**: `user-update-group`

### PostgreSQL Databases

Database-per-service pattern: each microservice maintains its own database for data isolation and independent scaling.

- **React Service Database** (`fleet_platform`, port 5432): users, games, rewards, community_posts, reviews, comments, coin_transactions, wishlist
- **Angular Service Database** (`fleet2`, port 5433): users (authentication-focused)

## Security Architecture

### Authentication Flow

User credentials → Angular MFE → Angular Spring Service → JWT token generated → stored in browser → included in Authorization header → API Gateway validates.

### Authorization

Role-Based Access Control: `USER` (standard permissions), `DEVELOPER` (can upload and sell games). JWT claims include user ID, roles, permissions. Protected endpoints require valid JWT token.

### CORS Configuration

Configured for cross-origin requests between MFEs. Development: permissive. Production: restricted to specific domains.


## Scalability

- Stateless services enable horizontal scaling
- Eureka provides client-side load balancing
- Database-per-service allows independent database scaling
- Connection pooling configured per service

## Monitoring

- Health checks: `/actuator/health` endpoints on all services
- Structured logging: JSON format with correlation IDs
- ELK Stack: Elasticsearch, Logstash, Kibana for centralized logging
- Metrics: Spring Boot Actuator metrics, service-level metrics

## Deployment Architecture

**Local Development**: Docker Compose orchestrates all services on single machine.

**Production (AWS)**:
- EC2 Instance #1: All application containers (microservices, frontends, infrastructure)
- EC2 Instance #2: Jenkins CI/CD, ELK Stack, build agents

## Design Patterns

- API Gateway Pattern
- Service Discovery Pattern (Eureka)
- Database-Per-Service Pattern
- Event-Driven Architecture (Kafka)
- Micro-Frontend Pattern
- Shared State Pattern


