import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const dataService: DataService = inject(DataService);

  return dataService.isAuthenticated().pipe(map((result) => {
    if (result)
      return true;
    else
      router.navigate(["/"]);
      return false;
    }));
};

export const unAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const dataService: DataService = inject(DataService);

  return dataService.isAuthenticated().pipe(map((result) => {
    if (!result)
      return true;
    else
      router.navigate(["/app"]);
      return false;
    }));
};
