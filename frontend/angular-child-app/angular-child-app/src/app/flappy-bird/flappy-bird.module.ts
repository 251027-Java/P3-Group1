import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlappyBirdComponent } from './flappy-bird.component';
import { GameService } from './services/game.service';
import { RenderService } from './services/render.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlappyBirdComponent
  ],
  providers: [
    GameService,
    RenderService
  ],
  exports: [
    FlappyBirdComponent
  ]
})
export class FlappyBirdModule { }
