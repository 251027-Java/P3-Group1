import { Injectable } from '@angular/core';
import { Bubble, Harpoon, Player } from '../models';
import { GAME_CONFIG, COLORS } from '../constants/game.constants';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  constructor() {}

  /**
   * Clear the canvas
   */
  clearCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
  }

  /**
   * Draw the ground
   */
  drawGround(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.GROUND;
    ctx.fillRect(0, GAME_CONFIG.CANVAS_HEIGHT - 10, GAME_CONFIG.CANVAS_WIDTH, 10);
  }

  /**
   * Draw a bubble
   */
  drawBubble(ctx: CanvasRenderingContext2D, bubble: Bubble): void {
    ctx.fillStyle = bubble.color;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLORS.BUBBLE_STROKE;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * Draw all bubbles
   */
  drawBubbles(ctx: CanvasRenderingContext2D, bubbles: Bubble[]): void {
    bubbles.forEach(bubble => this.drawBubble(ctx, bubble));
  }

  /**
   * Draw the player
   */
  drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
    // Player body
    ctx.fillStyle = COLORS.PLAYER;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player eye
    ctx.fillStyle = COLORS.PLAYER_EYE;
    ctx.fillRect(player.x + 15, player.y, 10, 10);
  }

  /**
   * Draw a harpoon
   */
  drawHarpoon(ctx: CanvasRenderingContext2D, harpoon: Harpoon): void {
    ctx.fillStyle = COLORS.HARPOON;
    ctx.fillRect(
      harpoon.x - 2, 
      harpoon.y, 
      4, 
      GAME_CONFIG.CANVAS_HEIGHT - harpoon.y
    );
  }

  /**
   * Draw all harpoons
   */
  drawHarpoons(ctx: CanvasRenderingContext2D, harpoons: Harpoon[]): void {
    harpoons.forEach(harpoon => this.drawHarpoon(ctx, harpoon));
  }

  /**
   * Draw the entire game scene
   */
  drawScene(
    ctx: CanvasRenderingContext2D,
    bubbles: Bubble[],
    player: Player,
    harpoons: Harpoon[]
  ): void {
    this.clearCanvas(ctx);
    this.drawGround(ctx);
    this.drawBubbles(ctx, bubbles);
    this.drawPlayer(ctx, player);
    this.drawHarpoons(ctx, harpoons);
  }
}
