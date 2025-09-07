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

// Enum: backend'deki QuestionType ile aynı isimleri kullan
export type QuestionType = 'SingleChoice' | 'MultipleChoice'; // gerekiyorsa genişlet

export interface OptionDto {
  id?: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionDto {
  id?: number;
  text: string;
  type: QuestionType;
  points: number;
  order: number;
  options: OptionDto[];
}

export interface QuizCreateDto {
  title: string;
  description?: string | null;
  timeLimitSeconds?: number | null;
  isPublished: boolean;
  questions: QuestionDto[]; // MinLength(1)
}

export interface QuizResponseDto {
  id: number;
  title: string;
  description?: string | null;
  isPublished: boolean;
  timeLimitSeconds?: number | null;
  createdAt: string;          // ISO date
  createdByUserId: number;
  questions: QuestionDto[];
}