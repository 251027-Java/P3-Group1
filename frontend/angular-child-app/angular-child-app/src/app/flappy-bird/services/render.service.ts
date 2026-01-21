import { Injectable } from '@angular/core';
import { Bird, Pipe } from '../models';
import { GAME_CONFIG, COLORS } from '../constants/game.constants';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  constructor() {}

  /**
   * Draw sky background with gradient
   */
  drawSky(ctx: CanvasRenderingContext2D): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, COLORS.SKY_TOP);
    gradient.addColorStop(1, COLORS.SKY_BOTTOM);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
  }

  /**
   * Draw scrolling ground
   */
  drawGround(ctx: CanvasRenderingContext2D, groundX: number): void {
    const groundY = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT;
    
    // Ground base
    ctx.fillStyle = COLORS.GROUND;
    ctx.fillRect(0, groundY, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.GROUND_HEIGHT);
    
    // Ground stripes for scrolling effect
    ctx.fillStyle = COLORS.GROUND_STRIPE;
    for (let x = groundX; x < GAME_CONFIG.CANVAS_WIDTH; x += 30) {
      ctx.fillRect(x, groundY, 20, GAME_CONFIG.GROUND_HEIGHT);
    }
    
    // Ground top border
    ctx.fillStyle = COLORS.PIPE_BORDER;
    ctx.fillRect(0, groundY, GAME_CONFIG.CANVAS_WIDTH, 3);
  }

  /**
   * Draw a pipe
   */
  drawPipe(ctx: CanvasRenderingContext2D, pipe: Pipe): void {
    const capHeight = 25;
    const capOverhang = 3;
    
    // Top pipe
    // Pipe cap
    ctx.fillStyle = COLORS.PIPE_CAP;
    ctx.fillRect(
      pipe.x - capOverhang,
      pipe.topHeight - capHeight,
      pipe.width + capOverhang * 2,
      capHeight
    );
    
    // Pipe body
    ctx.fillStyle = COLORS.PIPE_BODY;
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight - capHeight);
    
    // Pipe border
    ctx.strokeStyle = COLORS.PIPE_BORDER;
    ctx.lineWidth = 2;
    ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight - capHeight);
    ctx.strokeRect(
      pipe.x - capOverhang,
      pipe.topHeight - capHeight,
      pipe.width + capOverhang * 2,
      capHeight
    );
    
    // Bottom pipe
    const bottomHeight = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - pipe.bottomY;
    
    // Pipe cap
    ctx.fillStyle = COLORS.PIPE_CAP;
    ctx.fillRect(
      pipe.x - capOverhang,
      pipe.bottomY,
      pipe.width + capOverhang * 2,
      capHeight
    );
    
    // Pipe body
    ctx.fillStyle = COLORS.PIPE_BODY;
    ctx.fillRect(
      pipe.x,
      pipe.bottomY + capHeight,
      pipe.width,
      bottomHeight - capHeight
    );
    
    // Pipe border
    ctx.strokeStyle = COLORS.PIPE_BORDER;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      pipe.x,
      pipe.bottomY + capHeight,
      pipe.width,
      bottomHeight - capHeight
    );
    ctx.strokeRect(
      pipe.x - capOverhang,
      pipe.bottomY,
      pipe.width + capOverhang * 2,
      capHeight
    );
  }

  /**
   * Draw all pipes
   */
  drawPipes(ctx: CanvasRenderingContext2D, pipes: Pipe[]): void {
    pipes.forEach(pipe => this.drawPipe(ctx, pipe));
  }

  /**
   * Draw the bird with rotation
   */
  drawBird(ctx: CanvasRenderingContext2D, bird: Bird): void {
    ctx.save();
    
    // Translate to bird center for rotation
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate((bird.rotation * Math.PI) / 180);
    
    // Draw bird body
    ctx.fillStyle = COLORS.BIRD_BODY;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw wing
    ctx.fillStyle = COLORS.BIRD_WING;
    ctx.beginPath();
    ctx.ellipse(-bird.width / 6, 0, bird.width / 3, bird.height / 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eye white
    ctx.fillStyle = COLORS.BIRD_EYE_WHITE;
    ctx.beginPath();
    ctx.arc(bird.width / 4, -bird.height / 6, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eye pupil
    ctx.fillStyle = COLORS.BIRD_EYE_BLACK;
    ctx.beginPath();
    ctx.arc(bird.width / 4 + 1, -bird.height / 6, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw beak
    ctx.fillStyle = COLORS.BIRD_BEAK;
    ctx.beginPath();
    ctx.moveTo(bird.width / 2, 0);
    ctx.lineTo(bird.width / 2 + 8, -3);
    ctx.lineTo(bird.width / 2 + 8, 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Draw score
   */
  drawScore(ctx: CanvasRenderingContext2D, score: number): void {
    ctx.fillStyle = COLORS.TEXT_COLOR;
    ctx.strokeStyle = COLORS.TEXT_SHADOW;
    ctx.lineWidth = 3;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    const text = score.toString();
    ctx.strokeText(text, GAME_CONFIG.CANVAS_WIDTH / 2, 80);
    ctx.fillText(text, GAME_CONFIG.CANVAS_WIDTH / 2, 80);
  }

  /**
   * Draw the entire game scene
   */
  drawScene(
    ctx: CanvasRenderingContext2D,
    bird: Bird,
    pipes: Pipe[],
    groundX: number,
    score: number
  ): void {
    this.drawSky(ctx);
    this.drawPipes(ctx, pipes);
    this.drawGround(ctx, groundX);
    this.drawBird(ctx, bird);
    this.drawScore(ctx, score);
  }
}
