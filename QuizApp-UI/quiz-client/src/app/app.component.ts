import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/quizzes" class="brand">QuizApp</a>
      <nav>
        <a routerLink="/quizzes">Quizzes</a>
        <button *ngIf="auth.isAuthenticated()" (click)="logout()">Logout</button>
        <a *ngIf="!auth.isAuthenticated()" routerLink="/login">Login</a>
      </nav>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #1976d2;
      color: white;
    }
    .topbar .brand {
      font-weight: bold;
      color: white;
      text-decoration: none;
    }
    nav a, nav button {
      margin-left: 1rem;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: none;
    }
    .container {
      padding: 1rem;
    }
  `]
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
