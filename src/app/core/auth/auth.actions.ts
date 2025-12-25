import { createAction, props } from '@ngrx/store';
import { AuthTokens, AuthUser } from './auth.models';

export const loginRequested  = createAction('[Auth] Login Requested', props<{ login: string; password: string }>());
export const loginSucceeded  = createAction('[Auth] Login Succeeded', props<{ tokens: AuthTokens }>());
export const loginFailed     = createAction('[Auth] Login Failed', props<{ error: string }>());

export const meRequested     = createAction('[Auth] Me Requested');
export const meSucceeded     = createAction('[Auth] Me Succeeded', props<{ user: AuthUser }>());
export const meFailed        = createAction('[Auth] Me Failed', props<{ error: string }>());

export const scheduleRefresh = createAction('[Auth] Schedule Refresh');  // agenda timer
export const refreshRequested= createAction('[Auth] Refresh Requested');
export const refreshSucceeded= createAction('[Auth] Refresh Succeeded', props<{ tokens: AuthTokens }>());
export const refreshFailed   = createAction('[Auth] Refresh Failed', props<{ error: string }>());

export const unauthorized    = createAction('[Auth] Unauthorized'); // disparado pelo ErrorInterceptor 401
export const logoutRequested = createAction('[Auth] Logout Requested');
export const logoutSucceeded = createAction('[Auth] Logout Succeeded');
export const logoutFailed    = createAction('[Auth] Logout Failed', props<{ error: string }>());
