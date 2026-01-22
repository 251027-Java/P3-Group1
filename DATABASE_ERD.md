# P3 Fleet Gaming Platform - Database ERD

## Entity Relationship Diagram

This ERD shows the complete database schema for the Fleet Gaming Platform backend.

```mermaid
erDiagram
    %% ========================================
    %% CORE ENTITIES
    %% ========================================
    
    USER {
        BIGINT id PK "Auto-generated"
        VARCHAR displayName "User's display name (required)"
        VARCHAR displayImage "Profile image path/URL"
        ENUM level "USER, DEVELOPER, ADMIN"
        BOOLEAN canSell "Can user sell games"
        TEXT gamesInLibrary "JSON array of game IDs"
        TEXT wishlist "JSON array of game IDs"
        TEXT notifications "JSON array of notification objects"
    }
    
    GAME {
        BIGINT id PK "Auto-generated"
        VARCHAR name "Game title"
        DATE dateReleased "Release date"
        DOUBLE rating "Aggregate rating (e.g., 4.5)"
        VARCHAR developer "Primary developer name"
        VARCHAR publisher "Publisher name"
        VARCHAR size "File size (e.g., '1.2 GB')"
        VARCHAR profileImage "Profile image path/URL"
        VARCHAR backgroundImage "Background image path/URL"
        DOUBLE price "Base price"
        DOUBLE salePercent "Sale discount percentage"
        BOOLEAN onSale "Is game currently on sale"
        TEXT tags "JSON array of tags"
        TEXT developerLogs "JSON array of update logs"
        TEXT rewards "JSON array of in-game rewards"
    }
    
    REVIEW {
        BIGINT id PK "Auto-generated"
        INTEGER ratingNumber "Rating (1-5)"
        TEXT content "Review text"
        INTEGER likes "Number of likes"
        DATETIME createdAt "Creation timestamp"
        BIGINT user_id FK "Author of review"
        BIGINT game_id FK "Game being reviewed"
    }
    
    REWARD {
        BIGINT id PK "Auto-generated"
        VARCHAR title "Reward title (required)"
        BIGINT costInCoins "Cost in platform coins (required)"
        ENUM category "DISCOUNT, COSMETIC, etc."
        TEXT description "Reward description"
        DOUBLE discountPercent "Discount amount if applicable"
    }
    
    COIN_TRANSACTION {
        BIGINT id PK "Auto-generated"
        BIGINT amount "Coin amount (positive=earned, negative=spent)"
        VARCHAR reason "Transaction reason (required)"
        DATETIME timestamp "Transaction timestamp"
        BIGINT user_id FK "User who made transaction"
    }
    
    COMMUNITY_POST {
        BIGINT id PK "Auto-generated"
        VARCHAR title "Post title (required)"
        TEXT description "Post content"
        ENUM type "FORUM_POST, ANNOUNCEMENT, etc."
        DATETIME dateCreated "Creation timestamp"
        INTEGER likes "Number of likes"
        BIGINT author_id FK "Post author"
        TEXT tags "JSON array of tags"
        TEXT attachments "JSON array of attachment URLs"
    }
    
    COMMENT {
        BIGINT id PK "Auto-generated"
        TEXT text "Comment text (required)"
        DATETIME dateCreated "Creation timestamp"
        INTEGER likes "Number of likes"
        BIGINT author_id FK "Comment author"
        BIGINT post_id FK "Associated post"
        BIGINT parent_id FK "Parent comment (for replies)"
    }
    
    WISHLIST {
        BIGINT id PK "Auto-generated"
        DATETIME dateAdded "Date added to wishlist"
        BIGINT user_id FK "User who added"
        BIGINT game_id FK "Game in wishlist"
    }
    
    %% ========================================
    %% JOIN TABLES (Many-to-Many)
    %% ========================================
    
    USER_REWARDS {
        BIGINT user_id FK "User ID"
        BIGINT reward_id FK "Reward ID"
    }
    
    USER_FRIENDS {
        BIGINT user_id FK "User ID"
        BIGINT friend_id FK "Friend's User ID"
    }
    
    %% ========================================
    %% RELATIONSHIPS
    %% ========================================
    
    %% User Relationships
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ COIN_TRANSACTION : "has"
    USER ||--o{ COMMUNITY_POST : "authors"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ WISHLIST : "creates"
    USER }o--o{ USER : "friends with (self-referencing)"
    USER }o--o{ REWARD : "owns"
    
    %% Game Relationships
    GAME ||--o{ REVIEW : "receives"
    GAME ||--o{ WISHLIST : "appears in"
    
    %% Community Relationships
    COMMUNITY_POST ||--o{ COMMENT : "has"
    COMMENT ||--o{ COMMENT : "replies to (self-referencing)"
    
    %% Join Table Relationships
    USER_REWARDS }o--|| USER : ""
    USER_REWARDS }o--|| REWARD : ""
    USER_FRIENDS }o--|| USER : ""
```

## Relationship Details

### One-to-Many Relationships

| Parent Entity | Child Entity | Description | Foreign Key |
|--------------|--------------|-------------|-------------|
| **User** | Review | A user can write multiple reviews | `user_id` in Review |
| **User** | CoinTransaction | A user has multiple coin transactions | `user_id` in CoinTransaction |
| **User** | CommunityPost | A user can author multiple posts | `author_id` in CommunityPost |
| **User** | Comment | A user can write multiple comments | `author_id` in Comment |
| **User** | Wishlist | A user can have multiple wishlist entries | `user_id` in Wishlist |
| **Game** | Review | A game can have multiple reviews | `game_id` in Review |
| **Game** | Wishlist | A game can appear in multiple wishlists | `game_id` in Wishlist |
| **CommunityPost** | Comment | A post can have multiple comments | `post_id` in Comment |
| **Comment** | Comment | A comment can have multiple replies (self-referencing) | `parent_id` in Comment |

### Many-to-Many Relationships

| Entity 1 | Entity 2 | Join Table | Description |
|----------|----------|------------|-------------|
| **User** | **Reward** | `user_rewards` | Users can own multiple rewards, rewards can be owned by multiple users |
| **User** | **User** | `user_friends` | Self-referencing friendship relationship |

### Unique Constraints

- **Review**: `(user_id, game_id)` - One review per user per game
- **Wishlist**: Implicitly unique by design - one entry per user-game combination

### JSON/JSONB Fields

#### User JSON Fields
- `gamesInLibrary`: Array of game IDs the user owns
- `wishlist`: Array of game IDs (note: also tracked in Wishlist table for metadata)
- `notifications`: Array of notification objects

#### Game JSON Fields
- `tags`: Array of tag strings (e.g., `["Action", "RPG", "Multiplayer"]`)
- `developerLogs`: Array of update objects (e.g., `[{"title": "v1.1", "description": "Bug fixes"}]`)
- `rewards`: Array of in-game reward objects (e.g., `[{"id": 1, "title": "Gold Skin", "cost": 500}]`)

#### CommunityPost JSON Fields
- `tags`: Array of tag strings
- `attachments`: Array of attachment URLs (images, videos, screenshots)

## Enums

### UserLevel
```java
enum UserLevel {
    USER,
    DEVELOPER,
    ADMIN
}
```

### RewardCategory
```java
enum RewardCategory {
    DISCOUNT,
    COSMETIC,
    // ... other categories
}
```

### PostType
```java
enum PostType {
    FORUM_POST,
    ANNOUNCEMENT,
    // ... other types
}
```

## Cascade Behaviors

- **User → CommunityPost**: CASCADE ALL
- **User → Review**: No cascade (reviews remain if user deleted)
- **CommunityPost → Comment**: CASCADE ALL with ORPHAN REMOVAL
- **Comment → Comment (replies)**: CASCADE ALL

## Indexes (Recommended)

For optimal performance, consider these indexes:

```sql
-- User lookups
CREATE INDEX idx_user_displayname ON users(displayName);

-- Game searches
CREATE INDEX idx_game_developer ON games(developer);
CREATE INDEX idx_game_onsale ON games(onSale);
CREATE INDEX idx_game_rating ON games(rating);

-- Review queries
CREATE INDEX idx_review_game ON reviews(game_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_review_rating ON reviews(ratingNumber);

-- Community features
CREATE INDEX idx_post_author ON community_posts(author_id);
CREATE INDEX idx_post_type ON community_posts(type);
CREATE INDEX idx_comment_post ON comments(post_id);
CREATE INDEX idx_comment_parent ON comments(parent_id);

-- Wishlist lookups
CREATE INDEX idx_wishlist_user ON wishlists(user_id);
CREATE INDEX idx_wishlist_game ON wishlists(game_id);

-- Transactions
CREATE INDEX idx_transaction_user ON coin_transactions(user_id);
CREATE INDEX idx_transaction_timestamp ON coin_transactions(timestamp);
```

## Database Statistics

Based on seeded data:

| Entity | Seeded Records | Notes |
|--------|---------------|-------|
| Users | 2 | Neon_Architect (Developer), Alpha_Tester (User) |
| Games | 1 | Cyber Protocol |
| Reviews | 1 | Alpha_Tester's review of Cyber Protocol |
| Rewards | 1 | 10% Store Discount |
| CoinTransactions | 1 | Alpha_Tester's signup bonus |
| CommunityPosts | 1 | Help request post |
| Comments | 2 | Main comment + 1 reply |
| Friendships | 1 | Neon_Architect ↔ Alpha_Tester |

## Technology Stack

- **ORM**: Hibernate/JPA
- **Database**: PostgreSQL
- **JSON Handling**: Jackson with custom JsonConverter
- **Validation**: Jakarta Validation
- **Annotations**: Lombok for boilerplate reduction

---

**Last Updated**: January 2026
**Version**: 1.0
**Project**: P3 Fleet Gaming Platform
