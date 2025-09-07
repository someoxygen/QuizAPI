import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'quizzes', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  { path: 'register', 
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  {
    path: 'quizzes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/quiz-list/quiz-list.page').then(m => m.QuizListPage)
  },
  {
    path: 'play/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/quiz-play/quiz-play.page').then(m => m.QuizPlayPage)
  },
  {
    path: 'result/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/result/result.page').then(m => m.ResultPage)
  },
  {
    path: 'admin/quizzes/new',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/quiz-new/quiz-new.page').then(m => m.QuizNewPage)
  },
  // { path: 'admin/quizzes/:id/edit', 
  //   canActivate: [adminGuard], 
  //   loadComponent: () => import('./pages/admin/quiz-edit/quiz-edit.page').then(m => m.QuizEditPage) 
  // },
  { path: '**', redirectTo: 'quizzes' }
];
