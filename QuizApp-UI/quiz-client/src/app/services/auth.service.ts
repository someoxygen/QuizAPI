import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'quiz_token';

  register(payload: RegisterRequest) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/api/auth/register`, payload);
  }
  
  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, payload);
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
