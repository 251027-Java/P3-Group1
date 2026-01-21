# Database Schema Documentation

## Overview

GameHub Platform follows the **Database-Per-Service** pattern, where each microservice maintains its own PostgreSQL database. This ensures data isolation, independent scaling, and service autonomy.

## Database Architecture

### React Spring Service Database

**Database Name**: `fleet_platform`  
**Port**: 5432  
**Host**: `localhost` (development) / `postgres` (Docker)

#### Tables

- **users**: User profiles with display name, level, games library, wishlist, notifications. Relationships: Many-to-Many with rewards and users (friends), One-to-Many with community_posts.
- **games**: Game catalog with metadata, pricing, images, tags, developer logs, rewards. Relationship: One-to-Many with reviews.
- **rewards**: Rewards and achievements with title, cost, category, description. Relationship: Many-to-Many with users.
- **community_posts**: Community discussion posts with title, content, post type, author, game association. Relationships: Many-to-One with users, One-to-Many with comments.
- **reviews**: Game reviews with rating, comment, user, game. Relationships: Many-to-One with users and games.
- **comments**: Comments on community posts with content, author, post reference. Relationships: Many-to-One with users and community_posts.
- **coin_transactions**: Virtual currency transaction history with amount, type, description. Relationship: Many-to-One with users.
- **wishlist**: User wishlist entries with user and game references. Relationship: Many-to-One with users.

#### Join Tables

- **user_rewards**: Many-to-Many relationship between users and rewards. Composite primary key (user_id, reward_id).
- **user_friends**: Many-to-Many self-referential relationship for user friendships. Composite primary key (user_id, friend_id). Bidirectional relationship.

### Angular Spring Service Database

**Database Name**: `fleet2`  
**Port**: 5433  
**Host**: `localhost` (development) / `postgres` (Docker)

#### Tables

- **users**: Authentication and basic user management with username, password (BCrypt hashed), email, avatar URL, enabled status. Separate from React service user table, focused on authentication concerns.

## Entity Relationship Diagram (ERD)

### React Service Database ERD

```
┌─────────────┐
│    users    │
│─────────────│
│ id (PK)     │
│ display_name│
│ level       │
│ can_sell    │
└──────┬──────┘
       │
       │ 1:N
       │
       ├─────────────────┐
       │                 │
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────┐
│community_   │   │   reviews    │
│posts        │   │──────────────│
│─────────────│   │ id (PK)      │
│ id (PK)     │   │ rating       │
│ title       │   │ comment      │
│ content     │   │ user_id (FK) │
│ author_id   │   │ game_id (FK) │
│ post_type   │   └──────┬───────┘
└──────┬──────┘          │
       │                 │
       │ 1:N             │ N:1
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────┐
│  comments   │   │    games     │
│─────────────│   │──────────────│
│ id (PK)     │   │ id (PK)      │
│ content     │   │ name         │
│ author_id   │   │ price        │
│ post_id (FK)│   │ rating       │
└─────────────┘   │ developer    │
                  └──────────────┘

┌─────────────┐         ┌─────────────┐
│    users    │         │   rewards   │
│─────────────│         │─────────────│
│ id (PK)     │◄───M:N──┤ id (PK)     │
│ ...         │         │ title       │
└─────────────┘         │ cost_in_    │
       │                │   coins     │
       │ M:N            └─────────────┘
       │
       │ (self-referential)
       │
       ▼
┌─────────────┐
│user_friends │
│─────────────│
│ user_id (FK)│
│ friend_id   │
│   (FK)      │
└─────────────┘
```

## Database Normalization

All databases are normalized to 3NF.

## Indexes

Recommended indexes: display_name, level, game name/developer/rating, foreign keys, join table columns.

## Data Types and Constraints

### Common Patterns

1. **IDs**: `BIGSERIAL` for auto-incrementing primary keys
2. **Timestamps**: `TIMESTAMP` with timezone awareness
3. **JSON Data**: `TEXT` column with JSON conversion at application level
4. **Enums**: `VARCHAR` with application-level enum validation
5. **Booleans**: `BOOLEAN` with default values where appropriate

### Foreign Key Constraints

All foreign keys have:
- `ON DELETE CASCADE` or `ON DELETE SET NULL` as appropriate
- Referential integrity enforced
- Indexes on foreign key columns for performance

## Database Migrations

### Migration Strategy

1. **Development**: `spring.jpa.hibernate.ddl-auto=update` (auto-create/update)
2. **Production**: Use Flyway or Liquibase for versioned migrations
3. **Schema Changes**: Create migration scripts for all schema changes


## Backup and Recovery

### Backup Strategy

1. **Daily Full Backups**: Complete database dumps
2. **Transaction Log Backups**: Continuous WAL archiving
3. **Point-in-Time Recovery**: Enabled via WAL archiving

### Backup Commands

Use `pg_dump` for backups and `psql` for restore operations.

## Performance Optimization

- Indexes on all foreign keys and frequently queried columns
- Avoid N+1 queries: use JOIN FETCH or @EntityGraph in JPA
- Pagination for list queries
- Connection pooling via HikariCP

Connection pool configuration:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

## Data Integrity

- Primary keys on all tables
- Foreign keys with referential integrity
- Unique constraints on usernames and emails
- Check constraints: ratings 1-5, prices non-negative
- Application-level validation for email format, password strength, date ranges

## Security

- Encryption at rest and in transit (SSL/TLS)
- Role-based access control
- Password hashing with BCrypt
- Parameterized queries only

## Monitoring

Key metrics: connection pool usage, query execution times, lock contention, database size growth. Use `pg_stat_activity`, `pg_tables`, and `pg_stat_user_indexes` for monitoring.