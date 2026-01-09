import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';
import { CarrierCreateRequestDto, CarrierRow, CarrierUpdateRequestDto } from './carriers.models';
import { CarrierItemDto, CarrierListItemDto, toCarrier, toCarrierRow } from './carriers.mappers';

@Injectable({ providedIn: 'root' })
export class CarriersService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _carriers$ = new BehaviorSubject<CarrierRow[]>([]);
  readonly carriers$ = this._carriers$.asObservable();

  private readonly resource: string = '/carriers';

  constructor(http: HttpClient) {
    super(http);
  }

  load(params?: Record<string, string | number | boolean | undefined | null>): Observable<CarrierRow[]> {
    this._loading$.next(true);
    const httpParams = new HttpParams({ fromObject: this.buildParams(params) });

    return this.get<CarrierListItemDto[]>(`${this.resource}`, { params: httpParams }).pipe(
      map(list => (list ?? []).map(toCarrierRow)),
      tap(rows => this._carriers$.next(rows)),
      finalize(() => this._loading$.next(false))
    );
  }

  getById(uuid: string): Observable<CarrierRow> {
    this._loading$.next(true);
    return this.get<CarrierItemDto>(`${this.resource}/${uuid}`).pipe(
      map(toCarrier),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: CarrierCreateRequestDto): Observable<unknown> {
    this._loading$.next(true);
    return this.post<unknown>(`${this.resource}`, payload).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  update(uuid: string, payload: CarrierUpdateRequestDto): Observable<unknown> {
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
        message: 'Nenhum Tranportadora selecionado',
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
    const deletions = uuids.map(id => this.delete<unknown>(`/carriers/${id}`));

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
