import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@app/core/auth/auth.selectors';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      }

      return router.createUrlTree(['/auth/login'], {
        queryParams: { redirectTo: state.url }
      });
    })
  );
};
