export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expire_at: string; // ISO 8601
}

export type AuthUserStatus = 'super' | 'admin' | 'operator' | string;
export interface AuthUser {
  id: string;
  username: string;
  role?: AuthUserStatus; // extensível
  // outros campos do /auth/me
}

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';
export interface AuthState {
  tokens: AuthTokens | null;
  user: AuthUser | null;
  status: AuthStatus;
  error?: string | null;
}
