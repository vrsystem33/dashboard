import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { mockCustomers } from './customers.mock.data';

/** Domain model */
export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  sales: number;
  totalSpent: number; // in BRL
}

/**
 * CustomersService
 * - Mock service with in-memory store (can be replaced by HTTP easily)
 * - Exposes reactive streams for list and loading
 * - Methods return Observables to mimic async/http behavior
 */
@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _customers$ = new BehaviorSubject<Customer[]>(mockCustomers);
  readonly customers$ = this._customers$.asObservable();

  /** Simulate latency */
  private simulate<T>(value: T, ms = 400): Observable<T> {
    return of(value).pipe(delay(ms));
  }

  create(payload: Omit<Customer, 'id' | 'sales' | 'totalSpent'> & Partial<Pick<Customer,'sales'|'totalSpent'>>): Observable<Customer> {
    this._loading$.next(true);
    const customer: Customer = {
      id: crypto.randomUUID(),
      sales: payload.sales ?? 0,
      totalSpent: payload.totalSpent ?? 0,
      ...payload
    } as Customer;
    const list = [customer, ...this._customers$.value];
    return this.simulate(customer).pipe(
      map((c) => {
        this._customers$.next(list);
        this._loading$.next(false);
        return c;
      })
    );
  }

  update(id: string, patch: Partial<Customer>): Observable<Customer | undefined> {
    this._loading$.next(true);
    const list = this._customers$.value.map((c) => (c.id === id ? { ...c, ...patch } : c));
    const updated = list.find((c) => c.id === id);
    return this.simulate(updated).pipe(
      map((c) => {
        this._customers$.next(list);
        this._loading$.next(false);
        return c;
      })
    );
  }

  remove(id: string): Observable<boolean> {
    this._loading$.next(true);
    const list = this._customers$.value.filter((c) => c.id !== id);
    return this.simulate(true).pipe(
      map((ok) => {
        this._customers$.next(list);
        this._loading$.next(false);
        return ok;
      })
    );
  }

  removeMany(ids: string[]) {
    this._loading$.next(true);
    const set = new Set(ids);
    const next = this._customers$.value.filter(c => !set.has(c.id));
    return of(true).pipe(
      delay(400),
      map(() => {
        this._customers$.next(next);
        this._loading$.next(false);
      })
    );
  }
}
