// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <a routerLink="/quizzes" class="brand">QuizApp</a>
      <span class="spacer"></span>
      <a mat-button routerLink="/quizzes">Quizzes</a>
      <button *ngIf="auth.isAuthenticated()" mat-raised-button color="accent" (click)="logout()">
        Logout
      </button>
      <a *ngIf="!auth.isAuthenticated()" mat-stroked-button color="accent" routerLink="/login">Login</a>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .toolbar { position: sticky; top: 0; z-index: 1000; }
    .brand { color: #fff; text-decoration: none; font-weight: 700; letter-spacing: .5px; }
    .spacer { flex: 1 1 auto; }
  `]
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
