import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { RenderService } from './services/render.service';
import { GAME_CONFIG } from './constants/game.constants';

@Component({
  selector: 'app-bubble-trouble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble-trouble.component.html',
  styleUrls: ['./bubble-trouble.component.css']
})
export class BubbleTroubleComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  CANVAS_WIDTH = GAME_CONFIG.CANVAS_WIDTH;
  CANVAS_HEIGHT = GAME_CONFIG.CANVAS_HEIGHT;

  private ctx!: CanvasRenderingContext2D;

  constructor(
    public gameService: GameService,
    private renderService: RenderService
  ) { }

  ngOnInit(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));

    const animationId = this.gameService.getAnimationId();
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  /**
   * Handle keydown events
   */
  handleKeyDown(e: KeyboardEvent): void {
    this.gameService.keys[e.key] = true;

    if (e.key === ' ') {
      e.preventDefault();
      this.gameService.shootHarpoon();
    }
  }

  /**
   * Handle keyup events
   */
  handleKeyUp(e: KeyboardEvent): void {
    this.gameService.keys[e.key] = false;
  }

  /**
   * Main game loop
   */
  gameLoop(): void {
    // Render the scene
    this.renderService.drawScene(
      this.ctx,
      this.gameService.bubbles,
      this.gameService.player,
      this.gameService.harpoons
    );

    // Update bubbles
    for (let i = this.gameService.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.gameService.bubbles[i];

      // Update physics
      this.gameService.updateBubble(bubble);

      // Check collision with player
      if (this.gameService.checkCollision(bubble, this.gameService.player) &&
        !this.gameService.isRespawning) {
        this.gameService.handlePlayerDeath(() => {
          if (this.gameService.gameState === 'gameOver') {
            const animationId = this.gameService.getAnimationId();
            if (animationId) {
              cancelAnimationFrame(animationId);
            }
          }
        });
        continue;
      }

      // Check collision with harpoons
      let bubbleHit = false;
      for (let h = this.gameService.harpoons.length - 1; h >= 0; h--) {
        const harpoon = this.gameService.harpoons[h];

        if (this.gameService.checkHarpoonCollision(bubble, harpoon)) {
          this.gameService.splitBubble(bubble);
          this.gameService.bubbles.splice(i, 1);
          this.gameService.harpoons.splice(h, 1);
          bubbleHit = true;
          break;
        }
      }

      if (bubbleHit) continue;
    }

    // Update player
    this.gameService.updatePlayer();

    // Update harpoons
    this.gameService.updateHarpoons();

    // Check win condition
    if (this.gameService.bubbles.length === 0 &&
      this.gameService.gameState === 'playing' &&
      !this.gameService.isRespawning &&
      !this.gameService.levelCleared) {
      this.gameService.handleLevelComplete(() => {
        if (this.gameService.gameState === 'gameOver') {
          const animationId = this.gameService.getAnimationId();
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        }
      });
    }

    // Continue the animation loop
    const animationId = requestAnimationFrame(() => this.gameLoop());
    this.gameService.setAnimationId(animationId);
  }

  /**
   * Start a new game
   */
  startGame(): void {
    this.gameService.resetGame();

    setTimeout(() => {
      this.gameService.initLevel(1);
      this.gameLoop();
    }, 0);
  }

  /**
   * Get the current game state
   */
  get gameState() {
    return this.gameService.gameState;
  }

  /**
   * Get the current score
   */
  get score() {
    return this.gameService.score;
  }

  /**
   * Get the current level
   */
  get level() {
    return this.gameService.level;
  }

  /**
   * Get lives display
   */
  getLives(): string {
    return this.gameService.getLivesDisplay();
  }
}
