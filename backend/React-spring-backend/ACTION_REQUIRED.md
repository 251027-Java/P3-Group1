# 🚨 ACTION REQUIRED - Duplication Cleanup

## ⚠️ CRITICAL: Manual File Deletion Needed

The following files are duplicates and MUST be deleted manually:

```bash
# Navigate to your backend directory
cd backend/React-spring-backend/src/main/java/com/example/React_spring_service

# Delete these 4 files:
rm Entities/GameEntity.java
rm Repositories/GameEntityRepository.java
rm Services/GameService.java
rm Controller/GameController.java
```

---

## ✅ What Was Done

### Created (NEW)
- ✅ `Entities/PlayableGame.java` - Replaces GameEntity
- ✅ `Repositories/PlayableGameRepository.java` - Replaces GameEntityRepository
- ✅ `Services/PlayableGameService.java` - Replaces GameService
- ✅ `Controller/PlayableGameController.java` - Replaces GameController

### Updated (MODIFIED)
- ✅ `Entities/GameScore.java` - Now references PlayableGame
- ✅ `Repositories/GameScoreRepository.java` - Updated method names
- ✅ `Services/GameScoreService.java` - Uses PlayableGameRepository

---

## 🗑️ Files to Delete (OLD)

### 1. Entities/GameEntity.java
**Why:** Duplicate entity mapping to "games" table
**Replaced by:** PlayableGame.java

### 2. Repositories/GameEntityRepository.java  
**Why:** Repository for deleted entity
**Replaced by:** PlayableGameRepository.java

### 3. Services/GameService.java
**Why:** Service for deleted entity
**Replaced by:** PlayableGameService.java

### 4. Controller/GameController.java
**Why:** Controller for deleted service
**Replaced by:** PlayableGameController.java

---

## 🗄️ Database Migration Required

```sql
-- Run this SQL in your database:

-- 1. Create new playable_games table
CREATE TABLE IF NOT EXISTS playable_games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insert initial games
INSERT INTO playable_games (name, description) VALUES
('Bubble Trouble', 'Pop all the bubbles without getting hit! 10 levels of action.'),
('Flappy Bird', 'Fly through pipes without crashing. How far can you go?')
ON CONFLICT (name) DO NOTHING;

-- 3. If game_scores table exists, update the foreign key
-- (Only if you have existing data)
-- ALTER TABLE game_scores RENAME COLUMN game_id TO playable_game_id;

-- 4. If starting fresh, create game_scores table:
CREATE TABLE IF NOT EXISTS game_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    playable_game_id BIGINT NOT NULL,
    score INTEGER NOT NULL,
    level INTEGER,
    timestamp TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (playable_game_id) REFERENCES playable_games(id)
);
```

---

## 🧪 Testing Commands

```bash
# 1. Create a playable game
curl -X POST http://localhost:8080/api/playable-games \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Game","description":"Test"}'

# 2. Get all playable games
curl http://localhost:8080/api/playable-games

# 3. Submit a score (requires user_id=1 and playable_game_id=1)
curl -X POST http://localhost:8080/api/game-scores \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"gameId":1,"score":1000,"level":5}'

# 4. Get leaderboard
curl http://localhost:8080/api/game-scores/leaderboard/1?limit=10
```

---

## 📋 Complete Checklist

### Backend Cleanup
- [ ] Delete `Entities/GameEntity.java`
- [ ] Delete `Repositories/GameEntityRepository.java`
- [ ] Delete `Services/GameService.java`
- [ ] Delete `Controller/GameController.java`
- [ ] Run database migration SQL
- [ ] Restart Spring Boot application
- [ ] Test `/api/playable-games` endpoints
- [ ] Test `/api/game-scores` endpoints

### Frontend Updates (If needed)
- [ ] Change API calls from `/api/games` → `/api/playable-games`
- [ ] Update game ID references in score submissions
- [ ] Test game integration

---

## 🎯 Final Structure

```
Store Games (Marketplace):
  └── Game.java → games table
  └── GameRepository
  └── GlobalDataService.getAllGames()

Playable Games (Browser Games):
  └── PlayableGame.java → playable_games table  ✅ NEW
  └── PlayableGameRepository ✅ NEW
  └── PlayableGameService ✅ NEW
  └── PlayableGameController ✅ NEW

Game Scores:
  └── GameScore.java (updated) ✅ FIXED
  └── GameScoreRepository (updated) ✅ FIXED
  └── GameScoreService (updated) ✅ FIXED
  └── GameScoreController
```

---

## 🚀 Status

- ✅ **Duplication fixed**
- ✅ **New files created**
- ✅ **Existing files updated**
- ⏳ **Manual deletion pending**
- ⏳ **Database migration pending**
- ⏳ **Testing pending**

---

## 📞 Need Help?

See these files for details:
- `DUPLICATION_ANALYSIS.md` - Problem explanation
- `DUPLICATION_REMOVAL_SUMMARY.md` - Complete details
- `API_DOCUMENTATION.md` - Updated API docs

---

**Delete the 4 old files and run the database migration to complete the cleanup!** 🧹
