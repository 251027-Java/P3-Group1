import { Injectable } from '@angular/core';
import { Bird, Pipe, GameState } from '../models';
import { GAME_CONFIG } from '../constants/game.constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Game state
  gameState: GameState = 'start';
  score = 0;
  highScore = 0;
  
  // Game objects
  bird: Bird = {
    x: GAME_CONFIG.BIRD_X,
    y: GAME_CONFIG.BIRD_START_Y,
    width: GAME_CONFIG.BIRD_WIDTH,
    height: GAME_CONFIG.BIRD_HEIGHT,
    velocity: 0,
    rotation: 0
  };
  
  pipes: Pipe[] = [];
  groundX = 0;
  
  private animationId: number | null = null;

  constructor() {
    this.loadHighScore();
  }

  /**
   * Initialize the game
   */
  initGame(): void {
    this.bird = {
      x: GAME_CONFIG.BIRD_X,
      y: GAME_CONFIG.BIRD_START_Y,
      width: GAME_CONFIG.BIRD_WIDTH,
      height: GAME_CONFIG.BIRD_HEIGHT,
      velocity: 0,
      rotation: 0
    };
    
    this.pipes = [];
    this.groundX = 0;
    this.score = 0;
    
    // Create initial pipes
    this.createPipe(GAME_CONFIG.CANVAS_WIDTH);
    this.createPipe(GAME_CONFIG.CANVAS_WIDTH + GAME_CONFIG.PIPE_SPACING);
  }

  /**
   * Make the bird jump
   */
  jump(): void {
    if (this.gameState === 'playing') {
      this.bird.velocity = GAME_CONFIG.JUMP_STRENGTH;
    }
  }

  /**
   * Update bird physics
   */
  updateBird(): void {
    // Apply gravity
    this.bird.velocity += GAME_CONFIG.GRAVITY;
    
    // Limit max velocity
    if (this.bird.velocity > GAME_CONFIG.MAX_VELOCITY) {
      this.bird.velocity = GAME_CONFIG.MAX_VELOCITY;
    }
    
    // Update position
    this.bird.y += this.bird.velocity;
    
    // Update rotation based on velocity
    this.bird.rotation = Math.min(Math.max(this.bird.velocity * 3, -30), 90);
    
    // Check ground collision
    if (this.bird.y + this.bird.height >= GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT) {
      this.bird.y = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - this.bird.height;
      this.gameOver();
    }
    
    // Check ceiling collision
    if (this.bird.y <= 0) {
      this.bird.y = 0;
      this.bird.velocity = 0;
    }
  }

  /**
   * Create a new pipe
   */
  createPipe(x: number): void {
    const minHeight = GAME_CONFIG.MIN_PIPE_HEIGHT;
    const maxHeight = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.PIPE_GAP - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
    
    this.pipes.push({
      x: x,
      topHeight: topHeight,
      bottomY: topHeight + GAME_CONFIG.PIPE_GAP,
      width: GAME_CONFIG.PIPE_WIDTH,
      passed: false
    });
  }

  /**
   * Update pipes position
   */
  updatePipes(): void {
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      
      // Move pipe
      pipe.x -= GAME_CONFIG.PIPE_SPEED;
      
      // Check if bird passed pipe
      if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
        pipe.passed = true;
        this.score++;
        
        // Update high score
        if (this.score > this.highScore) {
          this.highScore = this.score;
          this.saveHighScore();
        }
      }
      
      // Remove off-screen pipes
      if (pipe.x + pipe.width < 0) {
        this.pipes.splice(i, 1);
      }
      
      // Check collision
      if (this.checkPipeCollision(pipe)) {
        this.gameOver();
      }
    }
    
    // Create new pipe when needed
    const lastPipe = this.pipes[this.pipes.length - 1];
    if (lastPipe && lastPipe.x < GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.PIPE_SPACING) {
      this.createPipe(GAME_CONFIG.CANVAS_WIDTH);
    }
  }

  /**
   * Check collision between bird and pipe
   */
  checkPipeCollision(pipe: Pipe): boolean {
    // Check if bird is within pipe's x range
    const birdRight = this.bird.x + this.bird.width;
    const birdLeft = this.bird.x;
    const pipeRight = pipe.x + pipe.width;
    const pipeLeft = pipe.x;
    
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      // Check if bird hits top or bottom pipe
      const birdTop = this.bird.y;
      const birdBottom = this.bird.y + this.bird.height;
      
      if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Update scrolling ground
   */
  updateGround(): void {
    this.groundX -= GAME_CONFIG.SCROLL_SPEED;
    
    // Reset ground position for infinite scroll
    if (this.groundX <= -30) {
      this.groundX = 0;
    }
  }

  /**
   * Handle game over
   */
  gameOver(): void {
    if (this.gameState === 'playing') {
      this.gameState = 'gameOver';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  /**
   * Start the game
   */
  startGame(): void {
    this.gameState = 'playing';
    this.initGame();
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    this.gameState = 'start';
    this.initGame();
  }

  /**
   * Set animation frame ID
   */
  setAnimationId(id: number | null): void {
    this.animationId = id;
  }

  /**
   * Get animation frame ID
   */
  getAnimationId(): number | null {
    return this.animationId;
  }

  /**
   * Save high score to localStorage
   */
  private saveHighScore(): void {
    try {
      localStorage.setItem('flappyBirdHighScore', this.highScore.toString());
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Load high score from localStorage
   */
  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem('flappyBirdHighScore');
      if (saved) {
        this.highScore = parseInt(saved, 10);
      }
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Get medal based on score
   */
  getMedal(): 'bronze' | 'silver' | 'gold' | null {
    if (this.score >= 40) return 'gold';
    if (this.score >= 20) return 'silver';
    if (this.score >= 10) return 'bronze';
    return null;
  }
}
