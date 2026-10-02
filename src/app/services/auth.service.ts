import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/catalog.model';
import { JwtResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private tokenKey = 'nexus_auth_token';
  private userKey = 'nexus_auth_user';

  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem(this.tokenKey));

  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.hasRole('ROLE_ADMIN'));
  isManager = computed(() => this.hasRole('ROLE_MANAGER') || this.hasRole('ROLE_ADMIN'));

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private hasRole(roleName: string): boolean {
    const user = this.currentUser();
    return !!user && !!user.roles && user.roles.includes(roleName);
  }

  login(credentials: LoginRequest): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.token.set(null);
    this.currentUser.set(null);
  }

  private setSession(authResult: JwtResponse) {
    localStorage.setItem(this.tokenKey, authResult.token);
    const user: User = {
      id: authResult.id,
      username: authResult.username,
      email: authResult.email,
      fullName: authResult.fullName,
      avatarUrl: authResult.avatarUrl,
      roles: authResult.roles
    };
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.token.set(authResult.token);
    this.currentUser.set(user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
