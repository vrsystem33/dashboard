import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.models';

export const initialAuthState: AuthState = {
  tokens: null,
  user: null,
  status: 'idle',
  error: null
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.loginRequested, (s) => ({
    ...s,
    status: 'authenticating' as const,
    error: null
  })),

  on(AuthActions.loginSucceeded, (s, { tokens }) => ({
    ...s,
    tokens,
    status: 'authenticated' as const,
    error: null
  })),

  on(AuthActions.loginFailed, (s, { error }) => ({
    ...s,
    status: 'error' as const,
    error
  })),

  on(AuthActions.meSucceeded, (s, { user }) => ({
    ...s,
    user,
    error: null
  })),

  on(AuthActions.refreshSucceeded, (s, { tokens }) => ({
    ...s,
    tokens,
    error: null
  })),

  on(AuthActions.refreshFailed, (s, { error }) => ({
    ...s,
    tokens: null,
    user: null,
    status: 'error' as const,
    error
  })),

  on(AuthActions.logoutSucceeded, () => initialAuthState)
);
