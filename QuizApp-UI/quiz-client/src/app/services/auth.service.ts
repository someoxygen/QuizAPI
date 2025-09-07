// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Interceptor'lı normal http (diğer tüm istekler için)
  private http = inject(HttpClient);

  // Interceptor'sız http (sadece auth için)
  private handler = inject(HttpBackend);
  private httpNoAuth = new HttpClient(this.handler);

  private readonly TOKEN_KEY = 'quiz_token';

  register(payload: RegisterRequest) {
    // Interceptor'sız gönder + token'ı otomatik kaydet
    return this.httpNoAuth
      .post<LoginResponse>(`${environment.apiUrl}/api/auth/register`, payload)
      .pipe(tap(res => this.saveToken(res.token)));
  }

  login(payload: LoginRequest) {
    // Interceptor'sız gönder + token'ı otomatik kaydet
    return this.httpNoAuth
      .post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, payload)
      .pipe(tap(res => this.saveToken(res.token)));
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
