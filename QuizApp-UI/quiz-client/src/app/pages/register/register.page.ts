import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatIconModule
  ]
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  fullName = '';
  password = '';
  confirm = '';
  hide1 = true;
  hide2 = true;
  loading = signal(false);
  error = signal<string | null>(null);

  submit(form: NgForm) {
    if (!form.valid) return;
    if (this.password !== this.confirm) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.register({ email: this.email, password: this.password, fullName: this.fullName }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/quizzes']);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}
