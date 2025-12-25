import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models';

export const selectAuthState  = createFeatureSelector<AuthState>('auth');
export const selectTokens     = createSelector(selectAuthState, s => s.tokens);
export const selectAccessToken= createSelector(selectTokens, t => t?.access_token ?? null);
export const selectUser       = createSelector(selectAuthState, s => s.user);
export const selectIsAuthenticated = createSelector(selectAuthState, s => !!s.tokens && s.status === 'authenticated');
export const selectRole       = createSelector(selectUser, u => u?.role);
export const selectAuthStatus = createSelector(selectAuthState, s => s.status);
export const selectAuthError = createSelector(selectAuthState, s => s.error ?? undefined);