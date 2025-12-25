import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { AuthResponse } from '../dto/auth/auth-response.dto';
import { LoginRequest, RefreshTokenRequest, LogoutRequest } from '../dto/auth/auth-request.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private readonly resource: string = '/auth';

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>(`${this.resource}/login`, payload);
  }

  getUserByToken(): Observable<any> {
    return this.get<any>(`${this.resource}/me`);
  }

  refreshToken(payload: RefreshTokenRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>(`${this.resource}/refresh`, payload);
  }

  logout(payload: LogoutRequest): Observable<void> {
    return this.post<void>(`${this.resource}/logout`, payload);
  }

  forgotPassword(payload: { email: string }) {
    return this.post<void>(`${this.resource}/forgot-password`, payload);
  }

  resetPassword(payload: { token: string; password: string }) {
    return this.post<void>(`${this.resource}/reset-password`, payload);
  }
}