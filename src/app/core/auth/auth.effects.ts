import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap, take, exhaustMap, withLatestFrom, timer, finalize } from 'rxjs';

import { AuthService } from '@app/services/auth.service';
import { TokenService } from '@app/services/token.service';

import { NgxSpinnerService } from 'ngx-spinner';

import * as AuthActions from './auth.actions';
import { AppState } from '../app.state';
import { selectTokens } from './auth.selectors';

@Injectable()
export class AuthEffects {

  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly store = inject<Store<AppState>>(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      exhaustMap(({ login, password }) =>
        this.auth.login({ login, password }).pipe(
          tap(tokens => this.tokenService.set(tokens)),
          map(tokens => AuthActions.loginSucceeded({ tokens })),
          catchError(err => of(AuthActions.loginFailed({ error: err.message ?? 'Login failed' })))
        )
      )
    )
  );

  // Após login, buscar /auth/me e agendar refresh
  afterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSucceeded),
      mergeMap(() => [
        AuthActions.meRequested(),
        AuthActions.scheduleRefresh()
      ])
    )
  );

  me$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.meRequested),
      exhaustMap(() =>
        this.auth.getUserByToken().pipe(
          map(user => AuthActions.meSucceeded({ user })),
          catchError(err => of(AuthActions.meFailed({ error: err.message ?? 'Me failed' })))
        )
      )
    )
  );

  afterMeSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.meSucceeded),
        tap(() => {
          const queryParams = this.router.parseUrl(this.router.url).queryParams;
          const redirect = queryParams['redirectTo'];
          this.router.navigateByUrl(redirect ?? '/');
        })
      ),
    { dispatch: false }
  );

  // Agenda um timer para renovar antes de expirar (~60s de margem)
  scheduleRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.scheduleRefresh),
      withLatestFrom(this.store.select(selectTokens).pipe(take(1))),
      switchMap(([_, tokens]) => {
        if (!tokens?.expire_at) return of(); // nada para agendar

        const expiresAt = new Date(tokens.expire_at).getTime();
        const now = Date.now();
        const marginMs = 120_000;
        const due = Math.max(expiresAt - now - marginMs, 5_000);

        return timer(due).pipe(
          map(() => AuthActions.refreshRequested()),
              // se um novo refresh concluir ou se der logout antes do timer, cancela
              // (evita timers órfãos e re-agendamentos redundantes)
              take(1)
          );
        })
      )
    );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshRequested),
      exhaustMap(() => {
        const tokens = this.tokenService.getTokens();
        if (!tokens?.refresh_token) return of(AuthActions.refreshFailed({ error: 'No refresh tokens' }));
        return this.auth.refreshToken({ refresh_token: tokens.refresh_token }).pipe(
          tap(newTokens => this.tokenService.set(newTokens)),
          map(newTokens => AuthActions.refreshSucceeded({ tokens: newTokens })),
          catchError(err => of(AuthActions.refreshFailed({ error: err?.message ?? 'Refresh failed' })))
        );
      })
    )
  );

  // Após refresh com sucesso, reagenda
  afterRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshSucceeded),
      map(() => AuthActions.scheduleRefresh())
    )
  );

  // 401 global (disparado pelo ErrorInterceptor) tenta refresh ou redireciona
  unauthorized$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.unauthorized),
      map(() => {
        const tokens = this.tokenService.getTokens();
        return tokens?.refresh_token
          ? AuthActions.refreshRequested()
          : AuthActions.logoutRequested();
      })
    )
  );

  // Se o refresh falhar, limpar estado e ir para /login
  refreshFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshFailed),
      tap(() => this.tokenService.clear()),
      tap(() => this.router.navigateByUrl('auth/login')),
      map(() => AuthActions.logoutSucceeded())
    )
  );

  // Logout explícito
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutRequested),
      tap(() => {
        this.spinner.show();
      }),
      exhaustMap(() => {
        const tokens = this.tokenService.getTokens();
        return this.auth.logout(tokens ? { refresh_token: tokens.refresh_token } : { refresh_token: '' })
          .pipe(
            map(() => AuthActions.logoutSucceeded()),
            catchError(err => of(AuthActions.logoutFailed({ error: err.message ?? 'Logout failed' }))),
            finalize(() => this.spinner.hide())
          );
      })
    )
  );

  // Após logout, limpar storage e ir ao login
  afterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSucceeded),
      tap(() => this.tokenService.clear()),
      tap(() => this.router.navigateByUrl('auth/login'))
    ),
    { dispatch: false }
  );
}
