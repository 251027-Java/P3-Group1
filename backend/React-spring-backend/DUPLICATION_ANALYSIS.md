# Duplication Analysis & Resolution Plan

## 🔍 Issues Found

### 1. CRITICAL: Two Game Entities Mapping to Same Table

**Problem:**
Both `Game.java` and `GameEntity.java` use `@Table(name = "games")`, causing a conflict.

**Files:**
- `Entities/Game.java` - Complex entity with pricing, reviews, JSONB data
- `Entities/GameEntity.java` - Simple entity for browser games (Bubble Trouble, Flappy Bird)

**Current Usage:**
- `Game.java` → Used by `GameRepository` → Used by `GlobalDataService` (for store games)
- `GameEntity.java` → Used by `GameEntityRepository` → Used by `GameService` (for playable games)

**Impact:**
- ❌ Database schema conflict
- ❌ Two entities can't map to same table
- ❌ JPA will throw errors
- ❌ Services are using different entities for the same concept

### 2. Duplicate Game Repositories

**Files:**
- `GameRepository.java` - For `Game` entity (store games)
- `GameEntityRepository.java` - For `GameEntity` entity (playable games)

### 3. Duplicate Game Services

**Files:**
- Implicit in `GlobalDataService` - CRUD for store `Game` entities
- `GameService.java` - CRUD for playable `GameEntity` entities

---

## 🎯 Resolution Strategy

### Option 1: Separate Tables (RECOMMENDED)

**Keep both entities but use different tables:**

1. **`Game` entity** → `@Table(name = "store_games")`
   - For games in the store/marketplace
   - Has pricing, reviews, tags, etc.
   - Used for browsing, purchasing

2. **`GameEntity` entity** → `@Table(name = "playable_games")` OR rename to `PlayableGame`
   - For actual playable games (Bubble Trouble, Flappy Bird)
   - Linked to scores
   - Simple metadata

**Benefits:**
- ✅ Clear separation of concerns
- ✅ No conflicts
- ✅ Both can coexist
- ✅ Store games vs Playable games are different concepts

### Option 2: Merge Entities (Complex)

Merge both into one `Game` entity with all fields. This would require:
- Major refactoring
- Schema changes
- All services update
- Risk of breaking existing code

❌ **Not recommended** - Too much existing code depends on current structure

---

## 📋 Recommended Changes

### Change 1: Rename GameEntity to PlayableGame

```java
// OLD: GameEntity.java
@Entity
@Table(name = "games")
public class GameEntity { ... }

// NEW: PlayableGame.java
@Entity
@Table(name = "playable_games")
public class PlayableGame { ... }
```

### Change 2: Update Repository

```java
// Rename: GameEntityRepository → PlayableGameRepository
public interface PlayableGameRepository extends JpaRepository<PlayableGame, Long> {
    Optional<PlayableGame> findByName(String name);
    boolean existsByName(String name);
}
```

### Change 3: Update Service

```java
// Rename: GameService → PlayableGameService
@Service
public class PlayableGameService {
    @Autowired
    private PlayableGameRepository playableGameRepository;
    
    // ... methods using PlayableGame
}
```

### Change 4: Update Controller

```java
// Update: GameController
@RestController
@RequestMapping("/api/playable-games")
public class PlayableGameController {
    @Autowired
    private PlayableGameService playableGameService;
    
    // All endpoints now reference playable games
}
```

### Change 5: Update GameScore References

```java
// In GameScore.java
@ManyToOne
@JoinColumn(name = "playable_game_id", nullable = false)
private PlayableGame playableGame;  // Changed from 'game'
```

---

## 🗂️ Final Structure

### Store Games (Marketplace)
```
Game.java (Entity)
  └── @Table(name = "store_games")
  └── Fields: pricing, rating, reviews, tags, etc.

GameRepository.java
  └── For Game entity

GlobalDataService.java
  └── Uses GameRepository
  └── Method: getAllGames() returns store games
```

### Playable Games (Browser Games)
```
PlayableGame.java (Entity)
  └── @Table(name = "playable_games")
  └── Fields: name, description, createdAt

PlayableGameRepository.java
  └── For PlayableGame entity

PlayableGameService.java
  └── Uses PlayableGameRepository
  └── CRUD for browser games

PlayableGameController.java
  └── Endpoints: /api/playable-games/*
```

### Game Scores
```
GameScore.java (Entity)
  └── @ManyToOne playableGame
  
GameScoreRepository.java
GameScoreService.java
GameScoreController.java
  └── Endpoints: /api/game-scores/*
```

---

## 🚀 Implementation Steps

1. ✅ Rename `GameEntity` → `PlayableGame`
2. ✅ Change `@Table(name = "playable_games")`
3. ✅ Rename `GameEntityRepository` → `PlayableGameRepository`
4. ✅ Rename `GameService` → `PlayableGameService`
5. ✅ Update `GameController` references
6. ✅ Update `GameScore` relationship
7. ✅ Update `GameScoreService` references
8. ✅ Update database schema (migration script)
9. ✅ Update API documentation
10. ✅ Test all endpoints

---

## 📊 Database Schema Changes

### Before (CONFLICT):
```sql
-- Both entities point here!
CREATE TABLE games (...)
```

### After (RESOLVED):
```sql
-- Store games (marketplace)
CREATE TABLE store_games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    date_released DATE,
    rating DOUBLE PRECISION,
    price DOUBLE PRECISION,
    tags JSONB,
    -- ... more fields
);

-- Playable games (browser games)
CREATE TABLE playable_games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000),
    created_at TIMESTAMP
);

-- Game scores
CREATE TABLE game_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    playable_game_id BIGINT NOT NULL,  -- Changed column name
    score INTEGER NOT NULL,
    level INTEGER,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (playable_game_id) REFERENCES playable_games(id)
);
```

---

## ⚠️ Current State Issues

1. **Cannot deploy** - JPA will fail with duplicate table mapping
2. **Schema confusion** - Unclear which entity to use
3. **Service conflicts** - Two services doing similar things
4. **API confusion** - Which endpoint for which games?

---

## ✅ After Resolution

1. **Clear separation** - Store games vs Playable games
2. **No conflicts** - Different tables, different purposes
3. **Maintainable** - Clear which entity to use when
4. **Scalable** - Can add features to each independently

---

## 🔄 Migration Path

If data already exists in `games` table:

```sql
-- 1. Rename existing table
ALTER TABLE games RENAME TO store_games;

-- 2. Create new playable_games table
CREATE TABLE playable_games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Insert browser games
INSERT INTO playable_games (name, description) VALUES
('Bubble Trouble', 'Pop all the bubbles without getting hit'),
('Flappy Bird', 'Fly through pipes without crashing');

-- 4. Update game_scores foreign key
ALTER TABLE game_scores 
  RENAME COLUMN game_id TO playable_game_id;
```

---

## 📝 Summary

**Problem:** 
Two entities mapping to same table causing conflict

**Solution:** 
Separate into `store_games` and `playable_games` tables

**Action Required:**
Refactor code to use distinct entity names and tables

**Benefit:**
Clean architecture, no conflicts, clear purpose for each entity
