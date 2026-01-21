import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleTroubleComponent } from './bubble-trouble.component';
import { GameService } from './services/game.service';
import { RenderService } from './services/render.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BubbleTroubleComponent
  ],
  providers: [
    GameService,
    RenderService
  ],
  exports: [
    BubbleTroubleComponent
  ]
})
export class BubbleTroubleModule { }
