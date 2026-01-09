import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';
import { UserCreateRequestDto, UserRow, UserUpdateRequestDto } from './users.models';
import { UserItemDto, UserListItemDto, toUser, toUserRow } from './users.mappers';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _users$ = new BehaviorSubject<UserRow[]>([]);
  readonly users$ = this._users$.asObservable();

  private readonly resource: string = '/users';

  constructor(http: HttpClient) {
    super(http);
  }

  load(params?: Record<string, string | number | boolean | undefined | null>): Observable<UserRow[]> {
    this._loading$.next(true);
    const httpParams = new HttpParams({ fromObject: this.buildParams(params) });

    return this.get<UserListItemDto[]>(`${this.resource}`, { params: httpParams }).pipe(
      map(list => (list ?? []).map(toUserRow)),
      tap(rows => this._users$.next(rows)),
      finalize(() => this._loading$.next(false))
    );
  }

  getById(uuid: string): Observable<UserRow> {
    this._loading$.next(true);
    return this.get<UserItemDto>(`${this.resource}/${uuid}`).pipe(
      map(toUser),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: UserCreateRequestDto): Observable<unknown> {
    this._loading$.next(true);
    return this.post<unknown>(`${this.resource}`, payload).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  update(uuid: string, payload: UserUpdateRequestDto): Observable<unknown> {
    this._loading$.next(true);
    return this.put<unknown>(`${this.resource}/${uuid}`, payload).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  remove(uuid: string): Observable<unknown> {
    this._loading$.next(true);
    return this.delete<unknown>(`${this.resource}/${uuid}`).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  removeMany(uuids: string[]): Observable<{
    message: string;
    deleted: number;
  }> {
    if (!uuids.length) {
      return of({
        message: 'Nenhum Usuários selecionado',
        deleted: 0,
      });
    }

    this._loading$.next(true);

    return this.delete<{
      message: string;
      deleted: number;
    }>(
      `${this.resource}/bulk-delete`,
      {uuids}
    ).pipe(
      finalize(() => this._loading$.next(false))
    );
  }
  /*
  removeMany(uuids: string[]): Observable<unknown> {
    if (!uuids.length) return of(null);
    this._loading$.next(true);
    const deletions = uuids.map(id => this.delete<unknown>(`/users/${id}`));

    return forkJoin(deletions).pipe(
      finalize(() => this._loading$.next(false))
    );
  }
  */

  private buildParams(params?: Record<string, string | number | boolean | undefined | null>): Record<string, string> {
    if (!params) return {};

    return Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value === undefined || value === null) return acc;
      acc[key] = String(value);
      return acc;
    }, {});
  }
}
