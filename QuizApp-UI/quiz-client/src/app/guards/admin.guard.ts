import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.getRole();        // 1=Admin, 2=Instructor
  if (auth.isAuthenticated() && (role === 1 || role === 2)) return true;
  router.navigate(['/quizzes']);
  return false;
};
