# Flappy Bird Game 🐦

A modern implementation of the classic Flappy Bird game built with Angular.

## Project Structure

```
flappy-bird/
├── constants/
│   └── game.constants.ts         # Game configuration and colors
├── models/
│   ├── bird.model.ts             # Bird interface
│   ├── pipe.model.ts             # Pipe interface
│   ├── game-state.model.ts       # GameState type
│   └── index.ts                  # Model exports
├── services/
│   ├── game.service.ts           # Core game logic and state
│   └── render.service.ts         # Canvas rendering
├── flappy-bird.component.ts      # Main component
├── flappy-bird.component.html    # Component template
├── flappy-bird.component.css     # Component styles
├── flappy-bird.module.ts         # Module definition
└── README.md                     # Documentation
```

## Features

### 🎮 Gameplay
- **Classic Flappy Bird mechanics** - Tap or click to flap
- **Infinite scrolling** - Procedurally generated pipes
- **Score tracking** - Current score and high score (saved to localStorage)
- **Medal system** - Earn bronze (10+), silver (20+), or gold (40+) medals
- **Smooth physics** - Gravity, velocity, and rotation

### 🎨 Visual Design
- **Beautiful gradient sky** - Dynamic background
- **Animated bird** - Rotates based on velocity, detailed design
- **3D-style pipes** - Green pipes with caps and borders
- **Scrolling ground** - Parallax effect
- **Responsive UI** - Works on desktop and mobile

### 📱 Controls
- **Mouse Click** - Click anywhere to flap
- **Touch** - Tap on mobile devices
- **Keyboard** - Press SPACE to flap

## Architecture

### Models (`models/`)
Defines the data structures:
- **Bird**: Position, size, velocity, rotation
- **Pipe**: Position, heights, passed status
- **GameState**: Type for game states (start, playing, gameOver)

### Constants (`constants/`)
Central configuration:
- **GAME_CONFIG**: Physics, dimensions, pipe settings
- **COLORS**: Complete color palette for consistent theming

### Services (`services/`)

#### GameService
Manages all game logic:
- Game state and scoring
- Bird physics (gravity, jumping, velocity)
- Pipe generation and movement
- Collision detection
- High score persistence (localStorage)
- Medal calculation

#### RenderService
Handles all rendering:
- Sky with gradient background
- Animated scrolling ground
- 3D-style pipes with caps
- Detailed bird with rotation
- Score display

### Component (`flappy-bird.component.*`)
Main orchestrator:
- Canvas initialization
- Event handling (click, touch, keyboard)
- Game loop coordination
- UI state management

## How to Use

### Import the Module

```typescript
import { FlappyBirdModule } from './flappy-bird/flappy-bird.module';

@NgModule({
  imports: [
    FlappyBirdModule
  ]
})
export class AppModule { }
```

### Use the Component

```html
<app-flappy-bird></app-flappy-bird>
```

### Optional: Add Routing

```typescript
const routes: Routes = [
  { path: 'flappy-bird', component: FlappyBirdComponent }
];
```

## Game Mechanics

### Physics
- **Gravity**: 0.5 (constant downward acceleration)
- **Jump Strength**: -8 (upward velocity on flap)
- **Max Velocity**: 10 (terminal velocity)
- **Rotation**: Bird tilts based on velocity

### Pipes
- **Gap Size**: 150 pixels
- **Speed**: 2 pixels per frame
- **Spacing**: 200 pixels apart
- **Random Heights**: Varies between safe limits

### Scoring
- **Points**: +1 for each pipe passed
- **High Score**: Automatically saved to localStorage
- **Medals**:
  - 🥉 Bronze: 10+ points
  - 🥈 Silver: 20+ points
  - 🥇 Gold: 40+ points

## Configuration

Edit `constants/game.constants.ts` to customize:

```typescript
export const GAME_CONFIG = {
  CANVAS_WIDTH: 400,        // Game width
  CANVAS_HEIGHT: 600,       // Game height
  GRAVITY: 0.5,             // Falling speed
  JUMP_STRENGTH: -8,        // Flap power
  PIPE_GAP: 150,            // Space between pipes
  PIPE_SPEED: 2,            // Pipe scroll speed
  // ... more settings
};

export const COLORS = {
  SKY_TOP: '#4ec0ca',       // Sky gradient top
  BIRD_BODY: '#FFD700',     // Bird color
  PIPE_BODY: '#5cb85c',     // Pipe color
  // ... complete color palette
};
```

## Development

### Adding Features

**Sound Effects**
Create an AudioService:
```typescript
@Injectable({ providedIn: 'root' })
export class AudioService {
  playFlap() { /* ... */ }
  playScore() { /* ... */ }
  playDie() { /* ... */ }
}
```

**Difficulty Levels**
Modify GAME_CONFIG based on level:
```typescript
increaseDifficulty() {
  GAME_CONFIG.PIPE_SPEED += 0.5;
  GAME_CONFIG.PIPE_GAP -= 10;
}
```

**Power-ups**
Add new models and collision detection:
```typescript
interface PowerUp {
  x: number;
  y: number;
  type: 'shield' | 'slowmo';
}
```

### Testing

**Unit Tests**
```typescript
// Test collision detection
it('should detect pipe collision', () => {
  const bird = { x: 50, y: 100, width: 34, height: 24 };
  const pipe = { x: 40, topHeight: 150, bottomY: 300 };
  expect(gameService.checkPipeCollision(pipe)).toBe(true);
});

// Test scoring
it('should increment score when pipe passed', () => {
  const initialScore = gameService.score;
  gameService.pipes[0].passed = false;
  gameService.pipes[0].x = gameService.bird.x - 60;
  gameService.updatePipes();
  expect(gameService.score).toBe(initialScore + 1);
});
```

**Integration Tests**
```typescript
it('should end game on collision', () => {
  component.startGame();
  gameService.bird.y = 0; // Force collision with top
  component.gameLoop();
  expect(gameService.gameState).toBe('gameOver');
});
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **60 FPS** using requestAnimationFrame
- **Optimized rendering** - Only draws visible elements
- **Efficient collision detection** - Early exit on obvious misses
- **Memory management** - Removes off-screen pipes

## Tips for High Scores

1. **Tap rhythm** - Find a consistent tapping pattern
2. **Look ahead** - Focus on upcoming pipes, not the bird
3. **Stay centered** - Fly through the middle of gaps
4. **Practice** - The first few pipes are always the hardest!

## Credits

Inspired by the original Flappy Bird by Dong Nguyen.

## License

MIT License - Feel free to use and modify!
