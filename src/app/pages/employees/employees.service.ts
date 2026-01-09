import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';
import { EmployeeCreateRequestDto, EmployeeRow, EmployeeUpdateRequestDto } from './employees.models';
import { EmployeeItemDto, EmployeeListItemDto, toEmployee, toEmployeeRow } from './employees.mappers';

@Injectable({ providedIn: 'root' })
export class EmployeesService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _employees$ = new BehaviorSubject<EmployeeRow[]>([]);
  readonly employees$ = this._employees$.asObservable();

  private readonly resource: string = '/employees';

  constructor(http: HttpClient) {
    super(http);
  }

  load(params?: Record<string, string | number | boolean | undefined | null>): Observable<EmployeeRow[]> {
    this._loading$.next(true);
    const httpParams = new HttpParams({ fromObject: this.buildParams(params) });

    return this.get<EmployeeListItemDto[]>(`${this.resource}`, { params: httpParams }).pipe(
      map(list => (list ?? []).map(toEmployeeRow)),
      tap(rows => this._employees$.next(rows)),
      finalize(() => this._loading$.next(false))
    );
  }

  getById(uuid: string): Observable<EmployeeRow> {
    this._loading$.next(true);
    return this.get<EmployeeItemDto>(`${this.resource}/${uuid}`).pipe(
      map(toEmployee),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: EmployeeCreateRequestDto): Observable<unknown> {
    this._loading$.next(true);
    return this.post<unknown>(`${this.resource}`, payload).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  update(uuid: string, payload: EmployeeUpdateRequestDto): Observable<unknown> {
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
        message: 'Nenhum Funcionário selecionado',
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
    const deletions = uuids.map(id => this.delete<unknown>(`/employees/${id}`));

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
