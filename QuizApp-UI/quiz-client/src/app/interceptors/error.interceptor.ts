// src/app/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);
  return next(req).pipe({
    error: (err:any) => {
      if (err instanceof HttpErrorResponse) {
        snack.open(err.error?.message || 'Unexpected error', 'Close', { duration: 3000 });
      }
      throw err;
    }
  } as any);
};
