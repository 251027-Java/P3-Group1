# Flappy Bird - Quick Start Guide

## Installation

### 1. Import the Module

In your `app.module.ts`:

```typescript
import { FlappyBirdModule } from './flappy-bird/flappy-bird.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlappyBirdModule  // Add this
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Use the Component

In your `app.component.html`:

```html
<app-flappy-bird></app-flappy-bird>
```

### 3. Run the Application

```bash
ng serve
```

Navigate to `http://localhost:4200`

## File Structure Overview

```
flappy-bird/
├── constants/
│   └── game.constants.ts      # Configure game here
├── models/
│   ├── bird.model.ts         # Bird data structure
│   ├── pipe.model.ts         # Pipe data structure
│   └── game-state.model.ts   # Game states
├── services/
│   ├── game.service.ts       # Game logic
│   └── render.service.ts     # Drawing logic
├── flappy-bird.component.ts   # Main component
├── flappy-bird.component.html # Template
├── flappy-bird.component.css  # Styles
└── flappy-bird.module.ts     # Module
```

## How to Play

1. **Click anywhere** or **press SPACE** to start
2. **Keep clicking/tapping** to stay airborne
3. **Avoid the pipes** - fly through the gaps
4. **Score points** by passing pipes
5. **Try to beat your high score!**

## Customization Examples

### Change Difficulty

Edit `constants/game.constants.ts`:

```typescript
export const GAME_CONFIG = {
  // Make it easier
  PIPE_GAP: 200,      // Bigger gap (default: 150)
  PIPE_SPEED: 1.5,    // Slower pipes (default: 2)
  GRAVITY: 0.3,       // Lighter gravity (default: 0.5)
  
  // Make it harder
  PIPE_GAP: 120,      // Smaller gap
  PIPE_SPEED: 3,      // Faster pipes
  GRAVITY: 0.7,       // Heavier gravity
};
```

### Change Colors

Edit `constants/game.constants.ts`:

```typescript
export const COLORS = {
  SKY_TOP: '#FF6B9D',        // Pink sky
  SKY_BOTTOM: '#FFC371',     // Orange gradient
  BIRD_BODY: '#FF1744',      // Red bird
  PIPE_BODY: '#7C4DFF',      // Purple pipes
  // ... customize all colors
};
```

### Change Canvas Size

Edit `constants/game.constants.ts`:

```typescript
export const GAME_CONFIG = {
  CANVAS_WIDTH: 600,   // Wider (default: 400)
  CANVAS_HEIGHT: 800,  // Taller (default: 600)
  // ...
};
```

## Features

### ✅ What's Included

- ✅ Smooth 60 FPS gameplay
- ✅ Click, touch, and keyboard controls
- ✅ Score tracking
- ✅ High score persistence (localStorage)
- ✅ Medal system (bronze, silver, gold)
- ✅ Beautiful graphics
- ✅ Responsive design
- ✅ Mobile-friendly
- ✅ Game over screen
- ✅ Animated bird rotation

### 🚀 Easy to Extend

- Add sound effects (create AudioService)
- Add background music
- Add multiple difficulty levels
- Add different bird skins
- Add power-ups
- Add achievements
- Add leaderboards
- Add multiplayer

## Common Issues

### Game doesn't start
**Solution**: Make sure you've imported `FlappyBirdModule` in your app module.

### Canvas is blank
**Solution**: Check browser console for errors. Ensure canvas has proper dimensions.

### High score not saving
**Solution**: localStorage might be disabled. Check browser settings.

### Game runs too fast/slow
**Solution**: Adjust `PIPE_SPEED` and `GRAVITY` in game.constants.ts

## Next Steps

1. ✅ Play the game!
2. 📖 Read the full README.md for detailed documentation
3. 🎨 Customize colors and settings
4. 🔧 Add new features
5. 🧪 Write tests
6. 🚀 Deploy to production

## Need Help?

- Check `README.md` for detailed documentation
- Review the code comments in each file
- Examine the service files for game logic
- Look at the constants file for all settings

Enjoy playing Flappy Bird! 🐦
