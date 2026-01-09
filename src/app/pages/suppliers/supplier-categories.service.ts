import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';

export interface SupplierCategory {
  id: number;
  name: string;
  description?: string;
  status: boolean;
}

export interface SupplierCategoryCreateRequestDto {
  name: string;
  description?: string;
  status?: boolean;
}

export type SupplierCategoryUpdateRequestDto = Partial<SupplierCategoryCreateRequestDto>;

@Injectable({ providedIn: 'root' })
export class SupplierCategoriesService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _categories$ = new BehaviorSubject<SupplierCategory[]>([]);
  readonly categories$ = this._categories$.asObservable();

  private readonly resource = '/suppliers/categories';

  constructor(http: HttpClient) {
    super(http);
  }

  load(): Observable<SupplierCategory[]> {
    this._loading$.next(true);
    return this.get<SupplierCategory[]>(this.resource).pipe(
      tap(categories => this._categories$.next(categories ?? [])),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: SupplierCategoryCreateRequestDto): Observable<SupplierCategory> {
    this._loading$.next(true);
    return this.post<SupplierCategory>(this.resource, payload).pipe(
      tap(category => this._categories$.next([...this._categories$.value, category])),
      finalize(() => this._loading$.next(false))
    );
  }

  update(id: number, payload: SupplierCategoryUpdateRequestDto): Observable<SupplierCategory> {
    this._loading$.next(true);
    return this.put<SupplierCategory>(`${this.resource}/${id}`, payload).pipe(
      tap((updated) => {
        const next = this._categories$.value.map(category =>
          category.id === id ? updated : category
        );
        this._categories$.next(next);
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  remove(id: number): Observable<void> {
    this._loading$.next(true);
    return this.delete<void>(`${this.resource}/${id}`).pipe(
      tap(() => {
        this._categories$.next(this._categories$.value.filter(category => category.id !== id));
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
