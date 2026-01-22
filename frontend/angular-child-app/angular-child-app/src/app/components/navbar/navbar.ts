import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.html',
    styles: []
})
export class NavbarComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    userProfile$: Observable<UserProfile | null>;

    constructor(private authService: AuthService, private router: Router) {
        this.userProfile$ = this.authService.userProfile$;
        this.isLoggedIn$ = this.userProfile$ as any;
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.authService.logout();
    }
}
