# Bubble Trouble Game

A classic bubble shooting game built with Angular.

## Project Structure

```
bubble-trouble/
├── constants/
│   └── game.constants.ts         # Game configuration and color constants
├── models/
│   ├── bubble.model.ts           # Bubble interface
│   ├── harpoon.model.ts          # Harpoon interface
│   ├── player.model.ts           # Player interface
│   ├── game-state.model.ts       # GameState type
│   └── index.ts                  # Model exports
├── services/
│   ├── game.service.ts           # Core game logic and state management
│   └── render.service.ts         # Canvas rendering logic
├── bubble-trouble.component.ts   # Main component
├── bubble-trouble.component.html # Component template
├── bubble-trouble.component.css  # Component styles
└── bubble-trouble.module.ts      # Module definition
```

## Architecture

### Models (`models/`)
Contains TypeScript interfaces that define the data structures used throughout the game:
- **Bubble**: Properties for bubble entities (position, velocity, color, etc.)
- **Harpoon**: Properties for harpoon projectiles
- **Player**: Properties for the player character
- **GameState**: Type definition for game states (start, playing, gameOver)

### Constants (`constants/`)
Central configuration file containing:
- **GAME_CONFIG**: Canvas dimensions, physics constants, game parameters
- **COLORS**: Color palette for all game elements

### Services (`services/`)

#### GameService
Handles all game logic and state management:
- Game state (score, level, lives)
- Game objects (player, bubbles, harpoons)
- Collision detection
- Physics updates
- Level initialization
- Player death and respawn logic
- Level completion handling

#### RenderService
Manages all canvas rendering:
- Drawing bubbles, player, harpoons, and ground
- Scene composition
- Visual effects

### Component (`bubble-trouble.component.*`)
The main component that:
- Initializes the canvas
- Handles keyboard input
- Runs the game loop
- Coordinates between game logic and rendering
- Manages component lifecycle

## How to Use

### Import the Module

```typescript
import { BubbleTroubleModule } from './bubble-trouble/bubble-trouble.module';

@NgModule({
  imports: [
    BubbleTroubleModule
  ]
})
export class AppModule { }
```

### Use the Component

```html
<app-bubble-trouble></app-bubble-trouble>
```

## Game Controls

- **Arrow Left/Right**: Move player
- **Spacebar**: Shoot harpoon (multiple shots allowed)

## Game Mechanics

1. **Objective**: Pop all bubbles without getting hit
2. **Bubble Splitting**: When hit, large bubbles split into two smaller bubbles
3. **Scoring**: Smaller bubbles give more points
4. **Lives**: Start with 3 lives, lose one when hit by a bubble
5. **Levels**: Progress through 10 levels, each adding more bubbles
6. **Victory**: Complete all 10 levels to win

## Configuration

To modify game parameters, edit `constants/game.constants.ts`:

```typescript
export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,           // Canvas width
  CANVAS_HEIGHT: 600,          // Canvas height
  GRAVITY: 0.2,                // Bubble gravity
  HARPOON_SPEED: 6,            // Harpoon speed
  INITIAL_LIVES: 3,            // Starting lives
  MAX_LEVEL: 10,               // Maximum level
  PLAYER_SPEED: 5,             // Player movement speed
  // ... more config options
};
```

## Development

### Adding New Features

1. **New game mechanics**: Add to `GameService`
2. **Visual changes**: Modify `RenderService` or CSS
3. **New entities**: Create models in `models/` directory
4. **UI changes**: Update component template and styles

### Testing Recommendations

- Test collision detection edge cases
- Verify physics behavior at different framerates
- Test keyboard input handling
- Verify game state transitions
- Test respawn and level progression logic

## Notes

- Services are provided at the root level for singleton behavior
- Game loop uses `requestAnimationFrame` for smooth 60 FPS gameplay
- All game constants are centralized for easy tuning
- Separation of concerns: logic (GameService), rendering (RenderService), and UI (Component)
