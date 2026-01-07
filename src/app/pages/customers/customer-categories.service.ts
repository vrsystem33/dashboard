import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';

export interface CustomerCategory {
  id: number;
  name: string;
  description?: string;
  status: boolean;
}

export interface CustomerCategoryCreateRequestDto {
  name: string;
  description?: string;
  status?: boolean;
}

export type CustomerCategoryUpdateRequestDto = Partial<CustomerCategoryCreateRequestDto>;

@Injectable({ providedIn: 'root' })
export class CustomerCategoriesService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _categories$ = new BehaviorSubject<CustomerCategory[]>([]);
  readonly categories$ = this._categories$.asObservable();

  private readonly resource = '/customers/categories';

  constructor(http: HttpClient) {
    super(http);
  }

  load(): Observable<CustomerCategory[]> {
    this._loading$.next(true);
    return this.get<CustomerCategory[]>(this.resource).pipe(
      tap(categories => this._categories$.next(categories ?? [])),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: CustomerCategoryCreateRequestDto): Observable<CustomerCategory> {
    this._loading$.next(true);
    return this.post<CustomerCategory>(this.resource, payload).pipe(
      tap(category => this._categories$.next([...this._categories$.value, category])),
      finalize(() => this._loading$.next(false))
    );
  }

  update(id: number, payload: CustomerCategoryUpdateRequestDto): Observable<CustomerCategory> {
    this._loading$.next(true);
    return this.put<CustomerCategory>(`${this.resource}/${id}`, payload).pipe(
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
