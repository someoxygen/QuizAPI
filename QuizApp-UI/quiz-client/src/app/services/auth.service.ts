import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private handler = inject(HttpBackend);
  private httpNoAuth = new HttpClient(this.handler);

  private readonly TOKEN_KEY = 'quiz_token';
  private readonly ROLE_KEY  = 'quiz_role';

  register(payload: RegisterRequest) {
    return this.httpNoAuth.post<LoginResponse>(`${environment.apiUrl}/api/auth/register`, payload)
      .pipe(tap(res => { this.saveToken(res.token); this.saveRole(res.role); }));
  }
  login(payload: LoginRequest) {
    return this.httpNoAuth.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, payload)
      .pipe(tap(res => { this.saveToken(res.token); this.saveRole(res.role); }));
  }

  saveToken(token: string){ localStorage.setItem(this.TOKEN_KEY, token); }
  getToken(){ return localStorage.getItem(this.TOKEN_KEY); }

  saveRole(role: number){ localStorage.setItem(this.ROLE_KEY, String(role)); }
  getRole(): number { return Number(localStorage.getItem(this.ROLE_KEY) ?? 0); }
  isAdmin(): boolean { return this.getRole() === 1; } // UserRole.Admin=1

  isAuthenticated(){ return !!this.getToken(); }
  logout(){ localStorage.removeItem(this.TOKEN_KEY); localStorage.removeItem(this.ROLE_KEY); }
}
