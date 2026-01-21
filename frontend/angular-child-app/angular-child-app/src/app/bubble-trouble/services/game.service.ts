import { Injectable } from '@angular/core';
import { Bubble, Harpoon, Player, GameState } from '../models';
import { GAME_CONFIG, COLORS } from '../constants/game.constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Game state
  gameState: GameState = 'start';
  score = 0;
  level = 1;
  lives = GAME_CONFIG.INITIAL_LIVES;
  isRespawning = false;
  levelCleared = false;

  // Game objects
  player: Player = {
    x: GAME_CONFIG.CANVAS_WIDTH / 2,
    y: GAME_CONFIG.CANVAS_HEIGHT - 50,
    width: GAME_CONFIG.PLAYER_WIDTH,
    height: GAME_CONFIG.PLAYER_HEIGHT,
    speed: GAME_CONFIG.PLAYER_SPEED
  };
  bubbles: Bubble[] = [];
  harpoons: Harpoon[] = [];
  keys: { [key: string]: boolean } = {};

  private animationId: number | null = null;

  constructor() {}

  /**
   * Initialize a new level with bubbles
   */
  initLevel(levelNum: number): void {
    this.bubbles = [];
    const numBubbles = levelNum;

    for (let i = 0; i < numBubbles; i++) {
      this.bubbles.push({
        x: 100 + i * 150,
        y: 200,
        radius: GAME_CONFIG.INITIAL_BUBBLE_RADIUS,
        vx: 1.5 + Math.random() * 1.5,
        vy: 0,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }

    this.player.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    this.harpoons = [];
  }

  /**
   * Split a bubble into two smaller bubbles
   */
  splitBubble(bubble: Bubble): void {
    const newRadius = bubble.radius / 2;

    if (newRadius >= GAME_CONFIG.MIN_BUBBLE_RADIUS) {
      this.bubbles.push({
        x: bubble.x - 10,
        y: bubble.y,
        radius: newRadius,
        vx: -Math.abs(bubble.vx) - 1,
        vy: -5,
        color: bubble.color
      });
      this.bubbles.push({
        x: bubble.x + 10,
        y: bubble.y,
        radius: newRadius,
        vx: Math.abs(bubble.vx) + 1,
        vy: -5,
        color: bubble.color
      });
    }

    this.score += Math.floor(50 / bubble.radius);
  }

  /**
   * Check collision between bubble and player
   */
  checkCollision(bubble: Bubble, player: Player): boolean {
    const dx = bubble.x - (player.x + player.width / 2);
    const dy = bubble.y - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < bubble.radius + player.width / 2;
  }

  /**
   * Update bubble physics
   */
  updateBubble(bubble: Bubble): void {
    bubble.vy += GAME_CONFIG.GRAVITY;
    bubble.y += bubble.vy;
    bubble.x += bubble.vx;

    // Bounce off ground
    if (bubble.y + bubble.radius >= GAME_CONFIG.CANVAS_HEIGHT) {
      bubble.y = GAME_CONFIG.CANVAS_HEIGHT - bubble.radius;
      bubble.vy = -Math.abs(bubble.vy);
      if (Math.abs(bubble.vy) < 4) {
        bubble.vy = -4;
      }
    }

    // Bounce off walls
    if (bubble.x - bubble.radius <= 0 || bubble.x + bubble.radius >= GAME_CONFIG.CANVAS_WIDTH) {
      bubble.vx *= -1;
      bubble.x = bubble.x - bubble.radius <= 0 
        ? bubble.radius 
        : GAME_CONFIG.CANVAS_WIDTH - bubble.radius;
    }
  }

  /**
   * Update player position based on keyboard input
   */
  updatePlayer(): void {
    if (this.keys['ArrowLeft'] && this.player.x > 0) {
      this.player.x -= this.player.speed;
    }
    if (this.keys['ArrowRight'] && this.player.x < GAME_CONFIG.CANVAS_WIDTH - this.player.width) {
      this.player.x += this.player.speed;
    }
  }

  /**
   * Shoot a new harpoon
   */
  shootHarpoon(): void {
    if (this.gameState === 'playing') {
      this.harpoons.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y
      });
    }
  }

  /**
   * Update harpoons position
   */
  updateHarpoons(): void {
    for (let h = this.harpoons.length - 1; h >= 0; h--) {
      this.harpoons[h].y -= GAME_CONFIG.HARPOON_SPEED;
      
      if (this.harpoons[h].y < 0) {
        this.harpoons.splice(h, 1);
      }
    }
  }

  /**
   * Check collision between harpoon and bubble
   */
  checkHarpoonCollision(bubble: Bubble, harpoon: Harpoon): boolean {
    const horizontalOverlap = Math.abs(bubble.x - harpoon.x) < bubble.radius + 2;
    const verticalOverlap = bubble.y + bubble.radius >= harpoon.y && 
                           bubble.y - bubble.radius <= GAME_CONFIG.CANVAS_HEIGHT;
    
    return horizontalOverlap && verticalOverlap;
  }

  /**
   * Handle player death
   */
  handlePlayerDeath(callback: () => void): void {
    this.isRespawning = true;
    const currentLevel = this.level;
    this.lives--;

    if (this.lives > 0) {
      setTimeout(() => {
        this.initLevel(currentLevel);
        this.isRespawning = false;
        callback();
      }, GAME_CONFIG.RESPAWN_DELAY);
    } else {
      this.gameState = 'gameOver';
    }

    this.bubbles = [];
    this.harpoons = [];
  }

  /**
   * Handle level completion
   */
  handleLevelComplete(callback: () => void): void {
    this.levelCleared = true;
    const currentLevel = this.level;

    setTimeout(() => {
      if (currentLevel >= GAME_CONFIG.MAX_LEVEL) {
        this.gameState = 'gameOver';
      } else {
        this.level = currentLevel + 1;
        this.initLevel(this.level);
      }
      this.levelCleared = false;
      callback();
    }, GAME_CONFIG.LEVEL_CLEAR_DELAY);
  }

  /**
   * Reset game to initial state
   */
  resetGame(): void {
    this.score = 0;
    this.level = 1;
    this.lives = GAME_CONFIG.INITIAL_LIVES;
    this.isRespawning = false;
    this.levelCleared = false;
    this.gameState = 'playing';
    this.keys = {};
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
   * Get lives as heart emojis
   */
  getLivesDisplay(): string {
    return '❤️'.repeat(this.lives);
  }
}
