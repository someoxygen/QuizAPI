import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'quiz_token';

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
