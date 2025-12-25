import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string; // ISO
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private _orders = new BehaviorSubject<Order[]>([
    {
      id: '1001',
      customerId: '1',
      customerName: 'Victor Lima',
      items: [
        { name: 'Plano Pro', quantity: 1, unitPrice: 199.9 },
        { name: 'Add-on WhatsApp', quantity: 2, unitPrice: 39.9 }
      ],
      status: 'pending',
      total: 279.7,
      createdAt: new Date(Date.now() - 1000*60*60*2).toISOString()
    },
    {
      id: '1002',
      customerId: '2',
      customerName: 'Alice Souza',
      items: [{ name: 'Plano Starter', quantity: 1, unitPrice: 49.9 }],
      status: 'preparing',
      total: 49.9,
      createdAt: new Date(Date.now() - 1000*60*60*26).toISOString()
    },
    {
      id: '1003',
      customerId: '3',
      customerName: 'Diego Ramos',
      items: [{ name: 'Plano Business', quantity: 1, unitPrice: 499.9 }],
      status: 'ready',
      total: 499.9,
      createdAt: new Date(Date.now() - 1000*60*60*30).toISOString()
    },
    {
      id: '1004',
      customerId: '4',
      customerName: 'Maria Fernanda',
      items: [{ name: 'Plano Business', quantity: 2, unitPrice: 499.9 }],
      status: 'delivered',
      total: 999.8,
      createdAt: new Date(Date.now() - 1000*60*60*80).toISOString()
    },
  ]);
  private _loading = new BehaviorSubject<boolean>(false);

  readonly orders$ = this._orders.asObservable();
  readonly loading$ = this._loading.asObservable();

  setStatus(id: string, status: OrderStatus) {
    this._loading.next(true);
    const next = this._orders.value.map(o => o.id === id ? { ...o, status } : o);
    return of(true).pipe(
      delay(250),
      map(() => {
        this._orders.next(next);
        this._loading.next(false);
      })
    );
  }

  remove(id: string) {
    this._loading.next(true);
    const next = this._orders.value.filter(o => o.id !== id);
    return of(true).pipe(
      delay(250),
      map(() => {
        this._orders.next(next);
        this._loading.next(false);
      })
    );
  }

  removeMany(ids: string[]) {
    this._loading.next(true);
    const idset = new Set(ids);
    const next = this._orders.value.filter(o => !idset.has(o.id));
    return of(true).pipe(
      delay(300),
      map(() => {
        this._orders.next(next);
        this._loading.next(false);
      })
    );
  }
}