import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';
import { CustomerCreateRequestDto, CustomerRow, CustomerUpdateRequestDto } from './payment-methods.models';
import { CustomerItemDto, CustomerListItemDto, toCustomer, toCustomerRow } from './payment-methods.mappers';

@Injectable({ providedIn: 'root' })
export class CustomersService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _customers$ = new BehaviorSubject<CustomerRow[]>([]);
  readonly customers$ = this._customers$.asObservable();

  private readonly resource: string = '/customers';

  constructor(http: HttpClient) {
    super(http);
  }

  load(params?: Record<string, string | number | boolean | undefined | null>): Observable<CustomerRow[]> {
    this._loading$.next(true);
    const httpParams = new HttpParams({ fromObject: this.buildParams(params) });

    return this.get<CustomerListItemDto[]>(`${this.resource}`, { params: httpParams }).pipe(
      map(list => (list ?? []).map(toCustomerRow)),
      tap(rows => this._customers$.next(rows)),
      finalize(() => this._loading$.next(false))
    );
  }

  getById(uuid: string): Observable<CustomerRow> {
    this._loading$.next(true);
    return this.get<CustomerItemDto>(`${this.resource}/${uuid}`).pipe(
      map(toCustomer),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: CustomerCreateRequestDto): Observable<unknown> {
    this._loading$.next(true);
    return this.post<unknown>(`${this.resource}`, payload).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  update(uuid: string, payload: CustomerUpdateRequestDto): Observable<unknown> {
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
        message: 'Nenhum cliente selecionado',
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
    const deletions = uuids.map(id => this.delete<unknown>(`/customers/${id}`));

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
