// src/app/pages/quiz-list/quiz-list.page.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';
import { Quiz } from '../../models';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.page.html',
  styleUrls: ['./quiz-list.page.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule]
})
export class QuizListPage implements OnInit {
  private qs = inject(QuizService);
  private router = inject(Router);

  quizzes = signal<Quiz[] | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.qs.getQuizzes().subscribe({
      next: (data) => { this.quizzes.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  play(q: Quiz) { this.router.navigate(['/play', q.id]); }
}
