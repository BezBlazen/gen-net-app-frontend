import { inject } from '@angular/core';
import { map } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.isAuthenticated().pipe(map((result) => {
    if (result)
      return true;
    else
      router.navigate(["/"]);
      return false;
    }));
};

export const unAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.isAuthenticated().pipe(map((result) => {
    if (!result)
      return true;
    else
      router.navigate(["/app"]);
      return false;
    }));
};
