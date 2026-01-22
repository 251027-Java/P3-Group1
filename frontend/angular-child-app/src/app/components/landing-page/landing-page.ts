import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  styles: [`
    :host { display: block; }
    /* Subtle custom font smoothing for that premium tech look */
    h1, h2 { -webkit-font-smoothing: antialiased; }
  `]
})
export class LandingPage {

  constructor(
    private router: Router,
  ) { }

  handleGetStarted(): void {
    console.log("this was clicked.")
    this.router.navigateByUrl('login');


  }

}
