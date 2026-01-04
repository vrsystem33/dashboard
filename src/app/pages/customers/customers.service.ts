import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';
import { CustomerCreateRequestDto, CustomerRow, CustomerUpdateRequestDto } from './customers.models';
import { CustomerListItemDto, toCustomerRow } from './customers.mappers';

@Injectable({ providedIn: 'root' })
export class CustomersService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _customers$ = new BehaviorSubject<CustomerRow[]>([]);
  readonly customers$ = this._customers$.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  load(params?: Record<string, string | number | boolean | undefined | null>): Observable<CustomerRow[]> {
    this._loading$.next(true);
    const httpParams = new HttpParams({ fromObject: this.buildParams(params) });

    return this.get<CustomerListItemDto[]>('/customers', { params: httpParams }).pipe(
      map(list => (list ?? []).map(toCustomerRow)),
      tap(rows => this._customers$.next(rows)),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: CustomerCreateRequestDto): Observable<unknown> {
    this._loading$.next(true);
    return this.post<unknown>('/customers', payload).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  update(uuid: string, payload: CustomerUpdateRequestDto): Observable<unknown> {
    this._loading$.next(true);
    return this.put<unknown>(`/customers/${uuid}`, payload).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  remove(uuid: string): Observable<unknown> {
    this._loading$.next(true);
    return this.delete<unknown>(`/customers/${uuid}`).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  removeMany(uuids: string[]): Observable<unknown> {
    if (!uuids.length) return of(null);
    this._loading$.next(true);
    const deletions = uuids.map(id => this.delete<unknown>(`/customers/${id}`));

    return forkJoin(deletions).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  private buildParams(params?: Record<string, string | number | boolean | undefined | null>): Record<string, string> {
    if (!params) return {};

    return Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value === undefined || value === null) return acc;
      acc[key] = String(value);
      return acc;
    }, {});
  }
}
