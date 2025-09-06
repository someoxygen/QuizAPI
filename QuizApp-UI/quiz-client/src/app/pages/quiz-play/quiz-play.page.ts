import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Quiz, SubmissionRequest, SubmitAnswer } from '../../models';

@Component({
  standalone: true,
  selector: 'app-quiz-play',
  templateUrl: './quiz-play.page.html',
  styleUrls: ['./quiz-play.page.css'],
  imports: [CommonModule]
})
export class QuizPlayPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qs = inject(QuizService);

  quiz = signal<Quiz | null>(null);
  idx = signal(0);
  selectedOptionId = signal<number | null>(null);
  answers = signal<SubmitAnswer[]>([]);
  loading = signal(false);

  currentQuestion = computed(() => {
    const q = this.quiz();
    return q?.questions?.[this.idx()] ?? null;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.qs.getQuizById(id).subscribe({
      next: q => { this.quiz.set(q); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  choose(optId: number) {
    this.selectedOptionId.set(optId);
  }

  next() {
    if (!this.currentQuestion() || this.selectedOptionId() == null) return;
    this.answers.update(prev => [
      ...prev.filter(a => a.questionId !== this.currentQuestion()!.id),
      { questionId: this.currentQuestion()!.id, selectedOptionId: this.selectedOptionId()! }
    ]);
    this.selectedOptionId.set(null);

    if (this.idx() + 1 < (this.quiz()?.questions?.length || 0)) {
      this.idx.update(v => v + 1);
    } else {
      this.submit();
    }
  }

  submit() {
    const payload: SubmissionRequest = {
      quizId: this.quiz()!.id,
      answers: this.answers()
    };
    this.qs.submitAnswers(payload).subscribe({
      next: res => this.router.navigate(['/result', this.quiz()!.id], { state: { result: res } })
    });
  }
}
