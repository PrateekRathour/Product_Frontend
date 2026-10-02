import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAdmin() || authService.isManager()) {
    return true;
  }

  toastService.error('Manager or Administrator role is required to access this page.');
  router.navigate(['/catalog']);
  return false;
};
