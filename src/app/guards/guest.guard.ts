import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@app/core/auth/auth.selectors';
import { map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate() {
    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      map(isAuth => {
        if (isAuth) {
          this.router.navigateByUrl('/');
          return false;
        }

        return true;
      })
    );
  }
}
