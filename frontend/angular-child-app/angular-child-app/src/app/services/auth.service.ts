import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, delay } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
    username?: string;
    password?: string;
}

export interface RegisterRequest {
    username?: string;
    email?: string;
    password?: string;
    avatarUrl?: string; // Optional
}

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

export interface UserProfile {
    id: number;
    displayName: string;
    displayImage: string;
    level: string;
    canSell: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // DIRECT CONNECTION (Bypassing Gateway for Debugging)
    // private authUrl = 'http://localhost:8081/api/auth';
    // private reactApiUrl = 'http://localhost:8082/api';

    // Gateway URL routing to Angular Backend
    private authUrl = 'http://localhost:8080/api/angular/api/auth';
    // Gateway URL routing to React Backend
    private reactApiUrl = 'http://localhost:8080/api';

    private tokenKey = 'auth_token';
    private userKey = 'auth_user';
    private profileKey = 'user_profile';

    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    private userProfileSubject = new BehaviorSubject<UserProfile | null>(this.getProfile());
    public userProfile$ = this.userProfileSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: LoginRequest): Observable<UserProfile> {
        // 1. Login to Angular Backend -> Get Token
        return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
            tap(response => this.saveSession(response)),
            // 2. Chain request to React Backend -> Get Profile
            switchMap(response => {
                return this.http.get<UserProfile>(`${this.reactApiUrl}/users/displayName/${response.username}`);
            }),
            tap(profile => this.saveProfile(profile))
        );
    }

    register(user: RegisterRequest): Observable<UserProfile> {
        return this.http.post<AuthResponse>(`${this.authUrl}/register`, user).pipe(
            tap(response => this.saveSession(response)),
            // Wait 500ms for Kafka to sync user to React Backend
            delay(500),
            switchMap(response => {
                return this.http.get<UserProfile>(`${this.reactApiUrl}/users/displayName/${response.username}`);
            }),
            tap(profile => this.saveProfile(profile))
        );
    }

    logout(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            localStorage.removeItem(this.profileKey);
        }
        this.currentUserSubject.next(null);
        this.userProfileSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    getUser(): AuthResponse | null {
        if (typeof localStorage !== 'undefined') {
            const userStr = localStorage.getItem(this.userKey);
            if (userStr) return JSON.parse(userStr);
        }
        return null;
    }

    getProfile(): UserProfile | null {
        if (typeof localStorage !== 'undefined') {
            const profileStr = localStorage.getItem(this.profileKey);
            if (profileStr) return JSON.parse(profileStr);
        }
        return null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    private saveSession(response: AuthResponse): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.userKey, JSON.stringify(response));
        }
        this.currentUserSubject.next(response);
    }

    private saveProfile(profile: UserProfile): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.profileKey, JSON.stringify(profile));
        }
        this.userProfileSubject.next(profile);
    }
}
