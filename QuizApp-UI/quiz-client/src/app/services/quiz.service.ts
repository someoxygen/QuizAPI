import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category, Quiz, Question, SubmissionRequest, SubmissionResult } from '../models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // Categories
  getCategories() {
    return this.http.get<Category[]>(`${this.base}/api/categories`);
  }

  // Quizzes
  getQuizzes() {
    return this.http.get<Quiz[]>(`${this.base}/api/quizzes`);
  }
  getQuizById(id: number) {
    return this.http.get<Quiz>(`${this.base}/api/quizzes/${id}`);
  }

  // Questions (filtre + sayfalama örneği)
  getQuestions(params?: { categoryId?: number; difficulty?: string; page?: number; pageSize?: number }) {
    let p = new HttpParams();
    if (params?.categoryId) p = p.set('category', params.categoryId);
    if (params?.difficulty) p = p.set('difficulty', params.difficulty);
    if (params?.page) p = p.set('page', params.page);
    if (params?.pageSize) p = p.set('pageSize', params.pageSize);
    return this.http.get<Question[]>(`${this.base}/api/questions`, { params: p });
  }

  // Submit
  submitAnswers(payload: SubmissionRequest) {
    return this.http.post<SubmissionResult>(`${this.base}/api/submissions`, payload);
  }
}
