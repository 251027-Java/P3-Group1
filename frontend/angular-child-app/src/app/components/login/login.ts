import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private router: Router,
  ) { }

  handleCreateAccount(): void {
    this.router.navigateByUrl("create-account")
  }

}
