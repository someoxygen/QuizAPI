import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  QuizCreateDto,
  QuizResponseDto,
  Quiz,
  SubmissionRequest,
  SubmissionResult,
} from '../models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getAll(includeUnpublished = false) {
    let params = new HttpParams();
    if (includeUnpublished) params = params.set('includeUnpublished', String(true));
    return this.http.get<QuizResponseDto[]>(`${this.base}/api/quizzes`, { params });
  }

  get(id: number) {
    return this.http.get<QuizResponseDto>(`${this.base}/api/quizzes/${id}`);
  }

  // Public/play endpoints used by pages
  getQuizzes() {
    return this.http.get<Quiz[]>(`${this.base}/api/quizzes`);
  }

  getQuizById(id: number) {
    return this.http.get<Quiz>(`${this.base}/api/quizzes/${id}`);
  }

  submitAnswers(payload: SubmissionRequest) {
    return this.http.post<SubmissionResult>(`${this.base}/api/submissions`, payload);
  }

  create(payload: QuizCreateDto) {
    return this.http.post<{ id: number }>(`${this.base}/api/quizzes`, payload);
  }

  update(id: number, payload: QuizCreateDto) {
    return this.http.put<void>(`${this.base}/api/quizzes/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/api/quizzes/${id}`);
  }
}
