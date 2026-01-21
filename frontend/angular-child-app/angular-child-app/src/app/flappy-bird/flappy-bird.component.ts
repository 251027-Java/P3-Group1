import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { RenderService } from './services/render.service';
import { GAME_CONFIG } from './constants/game.constants';

@Component({
  selector: 'app-flappy-bird',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flappy-bird.component.html',
  styleUrls: ['./flappy-bird.component.css']
})
export class FlappyBirdComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  CANVAS_WIDTH = GAME_CONFIG.CANVAS_WIDTH;
  CANVAS_HEIGHT = GAME_CONFIG.CANVAS_HEIGHT;

  private ctx!: CanvasRenderingContext2D;

  constructor(
    public gameService: GameService,
    private renderService: RenderService
  ) { }

  ngOnInit(): void {
    // Initialize game
    this.gameService.initGame();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Draw initial scene
    this.renderService.drawScene(
      this.ctx,
      this.gameService.bird,
      this.gameService.pipes,
      this.gameService.groundX,
      this.gameService.score
    );
  }

  ngOnDestroy(): void {
    const animationId = this.gameService.getAnimationId();
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  /**
   * Handle click/tap events for jumping
   */
  @HostListener('click')
  @HostListener('touchstart', ['$event'])
  onInteraction(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.gameService.gameState === 'start') {
      this.startGame();
    } else if (this.gameService.gameState === 'playing') {
      this.gameService.jump();
    }
  }

  /**
   * Handle spacebar for jumping
   */
  @HostListener('window:keydown.space', ['$event'])
  onSpacePress(event: Event): void {
    event.preventDefault();

    if (this.gameService.gameState === 'start') {
      this.startGame();
    } else if (this.gameService.gameState === 'playing') {
      this.gameService.jump();
    }
  }

  /**
   * Main game loop
   */
  gameLoop(): void {
    if (this.gameService.gameState !== 'playing') {
      return;
    }

    // Update game objects
    this.gameService.updateBird();
    this.gameService.updatePipes();
    this.gameService.updateGround();

    // Render the scene
    this.renderService.drawScene(
      this.ctx,
      this.gameService.bird,
      this.gameService.pipes,
      this.gameService.groundX,
      this.gameService.score
    );

    // Continue the animation loop
    if (this.gameService.gameState === 'playing') {
      const animationId = requestAnimationFrame(() => this.gameLoop());
      this.gameService.setAnimationId(animationId);
    }
  }

  /**
   * Start a new game
   */
  startGame(): void {
    this.gameService.startGame();
    this.gameLoop();
  }

  /**
   * Restart the game
   */
  restartGame(): void {
    this.gameService.resetGame();

    // Redraw initial scene
    setTimeout(() => {
      this.renderService.drawScene(
        this.ctx,
        this.gameService.bird,
        this.gameService.pipes,
        this.gameService.groundX,
        this.gameService.score
      );
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
   * Get the high score
   */
  get highScore() {
    return this.gameService.highScore;
  }

  /**
   * Get medal for current score
   */
  get medal() {
    return this.gameService.getMedal();
  }

  /**
   * Get medal emoji
   */
  getMedalEmoji(): string {
    const medal = this.medal;
    if (medal === 'gold') return '🥇';
    if (medal === 'silver') return '🥈';
    if (medal === 'bronze') return '🥉';
    return '';
  }
}
