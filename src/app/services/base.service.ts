import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export abstract class BaseService {
  protected readonly baseUrl: string = environment.base_url;

  constructor(protected http: HttpClient) {}

  protected get<T>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, options);
  }

  protected post<T>(url: string, body: unknown, options?: object): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, options);
  }

  protected put<T>(url: string, body: unknown, options?: object): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body, options);
  }

  protected delete<T>(url: string, options?: object): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`, options);
  }

  /**
    protected withAuthHeader(token: string): { headers: HttpHeaders } {
      return {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      };
    }
  */
}
