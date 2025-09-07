export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  fullName?: string;
  role: number;
}


export interface Category {
  id: number;
  name: string;
}

export interface Option {
  id: number;
  text: string;
  isCorrect?: boolean; // backend play akışında dönmeyebilir
}

export interface Question {
  id: number;
  text: string;
  difficulty?: string;
  categoryId?: number;
  options: Option[];
}

export interface Quiz {
  id: number;
  title: string;
  questionIds?: number[];
  questions?: Question[];
}

export interface SubmitAnswer {
  questionId: number;
  selectedOptionId: number;
}
export interface SubmissionRequest {
  quizId: number;
  answers: SubmitAnswer[];
}
export interface SubmissionResult {
  quizId: number;
  correctCount: number;
  total: number;
  score: number; // 0-100
}
