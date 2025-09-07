import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { QuizService } from '../../../services/quiz.service';
import { QuizCreateDto, QuestionDto, OptionDto, QuestionType } from '../../../models';

@Component({
  standalone: true,
  selector: 'app-quiz-new',
  templateUrl: './quiz-new.page.html',
  styleUrls: ['./quiz-new.page.scss'],
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule, MatSlideToggleModule, MatDividerModule
  ]
})
export class QuizNewPage {
  private router = inject(Router);
  private qs = inject(QuizService);

  title = '';
  description = '';
  timeLimitSeconds?: number;
  isPublished = false;

  questions = signal<QuestionDto[]>([
    {
      text: '',
      type: 'SingleChoice',
      points: 1,
      order: 0,
      options: [
        { text: '', isCorrect: true,  order: 0 },
        { text: '', isCorrect: false, order: 1 }
      ]
    }
  ]);

  saving = signal(false);
  error = signal<string | null>(null);

  addQuestion() {
    const order = this.questions().length;
    this.questions.update(arr => [...arr, {
      text: '',
      type: 'SingleChoice',
      points: 1,
      order,
      options: [
        { text: '', isCorrect: true,  order: 0 },
        { text: '', isCorrect: false, order: 1 }
      ]
    }]);
  }
  removeQuestion(i: number) {
    this.questions.update(arr => arr.filter((_, idx) => idx !== i).map((q,idx)=> ({...q, order: idx})));
  }
  addOption(qi: number) {
    this.questions.update(arr => {
      const nextOrder = arr[qi].options.length;
      arr[qi].options.push({ text: '', isCorrect: false, order: nextOrder });
      return [...arr];
    });
  }
  removeOption(qi: number, oi: number) {
    this.questions.update(arr => {
      arr[qi].options.splice(oi, 1);
      // order yeniden sırala
      arr[qi].options = arr[qi].options.map((o, idx) => ({ ...o, order: idx }));
      return [...arr];
    });
  }
  markCorrect(qi: number, oi: number, type: QuestionType) {
    this.questions.update(arr => {
      if (type === 'SingleChoice') {
        arr[qi].options = arr[qi].options.map((o, idx) => ({ ...o, isCorrect: idx === oi }));
      } else {
        // MultipleChoice: toggle
        arr[qi].options[oi].isCorrect = !arr[qi].options[oi].isCorrect;
      }
      return [...arr];
    });
  }
  onTypeChange(qi: number) {
    // SingleChoice'e geçildiyse maksimum 1 doğru kalsın
    this.questions.update(arr => {
      if (arr[qi].type === 'SingleChoice') {
        let first = true;
        arr[qi].options = arr[qi].options.map(o => ({ ...o, isCorrect: first ? (first = false, true) : false }));
      }
      return [...arr];
    });
  }

  submit(f: NgForm) {
    if (!f.valid) return;
    this.error.set(null);

    const payload: QuizCreateDto = {
      title: this.title.trim(),
      description: this.description?.trim() || undefined,
      timeLimitSeconds: this.timeLimitSeconds ?? undefined,
      isPublished: this.isPublished,
      questions: this.questions().map((q, qi) => ({
        text: q.text.trim(),
        type: q.type,
        points: Number(q.points) || 1,
        order: qi,
        options: q.options.map((o, oi) => ({
          text: o.text.trim(),
          isCorrect: !!o.isCorrect,
          order: oi
        }))
      }))
    };

    // en az 1 soru ve her soruda en az 2 şık + en az bir doğru kontrolü
    if (!payload.questions.length || payload.questions.some(q => q.options.length < 2 || !q.options.some(o => o.isCorrect))) {
      this.error.set('Each question must have at least two options and one correct answer.');
      return;
    }

    this.saving.set(true);
    this.qs.create(payload).subscribe({
      next: (r) => this.router.navigate(['/play', r.id]),
      error: (err) => { this.error.set(err?.error?.message || 'Cannot create quiz'); this.saving.set(false); }
    });
  }
}
