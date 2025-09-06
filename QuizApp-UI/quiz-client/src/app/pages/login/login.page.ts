import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  submit() {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/quizzes']);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Login failed');
        this.loading.set(false);
      }
    });
  }
}
