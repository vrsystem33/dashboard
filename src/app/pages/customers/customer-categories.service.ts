import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';

export interface CustomerCategory {
  id: number;
  name: string;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class CustomerCategoriesService extends BaseService {
  private readonly _categories$ = new BehaviorSubject<CustomerCategory[]>([]);
  readonly categories$ = this._categories$.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  load(): Observable<CustomerCategory[]> {
    return this.get<CustomerCategory[]>('/customers/categories').pipe(
      tap(categories => this._categories$.next(categories ?? []))
    );
  }

  create(payload: Pick<CustomerCategory, 'name'> & Partial<Pick<CustomerCategory, 'status'>>): Observable<unknown> {
    return this.post<unknown>('/customers/categories', payload).pipe(
      switchMap(() => this.load())
    );
  }
}
