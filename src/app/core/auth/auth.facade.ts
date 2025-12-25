import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly accessToken$ = this.store.select(AuthSelectors.selectAccessToken);
  readonly isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  readonly user$ = this.store.select(AuthSelectors.selectUser);

  login(login: string, password: string) {
    this.store.dispatch(AuthActions.loginRequested({ login, password }));
  }

  logout() {
    this.store.dispatch(AuthActions.logoutRequested());
  }
}
