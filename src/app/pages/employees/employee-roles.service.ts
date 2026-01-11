import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';

export interface EmployeeRole {
  id: number;
  name: string;
  description?: string;
  status: boolean;
}

export interface EmployeeRoleCreateRequestDto {
  name: string;
  description?: string;
  status?: boolean;
}

export type EmployeeRoleUpdateRequestDto = Partial<EmployeeRoleCreateRequestDto>;

@Injectable({ providedIn: 'root' })
export class EmployeeRolesService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _roles$ = new BehaviorSubject<EmployeeRole[]>([]);
  readonly roles$ = this._roles$.asObservable();

  private readonly resource = '/employees/roles';

  constructor(http: HttpClient) {
    super(http);
  }

  load(): Observable<EmployeeRole[]> {
    this._loading$.next(true);
    return this.get<EmployeeRole[]>(this.resource).pipe(
      tap(roles => this._roles$.next(roles ?? [])),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: EmployeeRoleCreateRequestDto): Observable<EmployeeRole> {
    this._loading$.next(true);
    return this.post<EmployeeRole>(this.resource, payload).pipe(
      tap(role => this._roles$.next([...this._roles$.value, role])),
      finalize(() => this._loading$.next(false))
    );
  }

  update(id: number, payload: EmployeeRoleUpdateRequestDto): Observable<EmployeeRole> {
    this._loading$.next(true);
    return this.put<EmployeeRole>(`${this.resource}/${id}`, payload).pipe(
      tap((updated) => {
        const next = this._roles$.value.map(role =>
          role.id === id ? updated : role
        );
        this._roles$.next(next);
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  remove(id: number): Observable<void> {
    this._loading$.next(true);
    return this.delete<void>(`${this.resource}/${id}`).pipe(
      tap(() => {
        this._roles$.next(this._roles$.value.filter(role => role.id !== id));
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  removeMany(ids: number[]): Observable<{ message: string; deleted: number; }> {
    this._loading$.next(true);
    return this.delete<{ message: string; deleted: number; }>(
      `${this.resource}/bulk-delete`,
      { ids }
    ).pipe(
      finalize(() => this._loading$.next(false))
    );
  }
}
