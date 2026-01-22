import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount {

  constructor(
    private router: Router,
  ) { }

  handleSignIn(): void {
    this.router.navigateByUrl("login")
  }
}
