import { Injectable } from '@angular/core';
import { AuthTokens } from 'src/app/core/auth/auth.models';

const KEY = '__tokens__';

@Injectable({ providedIn: 'root' })
export class TokenService {

  set(tokens: AuthTokens): void {
    if (!tokens?.access_token || !tokens?.refresh_token) return;
    localStorage.setItem(KEY, JSON.stringify(tokens));
  }

  getTokens(): AuthTokens | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as AuthTokens : null;
  }

  getAccessToken(): string | null {
    return this.getTokens()?.access_token ?? null;
  }

  clear(): void {
    localStorage.removeItem(KEY);
  }
}
