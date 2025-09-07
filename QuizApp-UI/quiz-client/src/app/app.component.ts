import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
  template: `
  <mat-toolbar color="primary" style="position:sticky;top:0;z-index:10">
    <a routerLink="/quizzes" class="topbar-brand">QuizApp</a>
    <span class="spacer"></span>

    <mat-slide-toggle (change)="toggleTheme($event.checked)" [checked]="isDark()">Dark</mat-slide-toggle>
    <span style="width:8px"></span>
    <a *ngIf="auth.isAuthenticated() && auth.isAdmin()" mat-stroked-button class="pill" routerLink="/admin/quizzes/new">New Quiz</a>
    <a *ngIf="!auth.isAuthenticated()" mat-stroked-button color="accent" class="pill" routerLink="/login">Login</a>
    <a *ngIf="!auth.isAuthenticated()" mat-raised-button color="accent" class="pill" style="margin-left:8px" routerLink="/register">Register</a>

    <a *ngIf="auth.isAuthenticated()" mat-button routerLink="/quizzes">Quizzes</a>
    <button *ngIf="auth.isAuthenticated()" mat-raised-button color="accent" class="pill" style="margin-left:8px" (click)="logout()">Logout</button>
  </mat-toolbar>

  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`.spacer{flex:1 1 auto}`]
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private isDarkSig = signal<boolean>(false);

  ngOnInit(){ document.body.classList.toggle('dark-theme', this.isDarkSig()); }
  isDark(){ return this.isDarkSig(); }
  toggleTheme(v:boolean){ this.isDarkSig.set(v); document.body.classList.toggle('dark-theme', v); }

  logout(){ this.auth.logout(); this.router.navigate(['/login']); }
}
