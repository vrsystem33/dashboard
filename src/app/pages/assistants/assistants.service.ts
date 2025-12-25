import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Assistant, AssistantForm } from './assistants.model';

@Injectable({ providedIn: 'root' })
export class AssistantsService {
  private readonly _loading = new BehaviorSubject<boolean>(false);
  private readonly _assistants = new BehaviorSubject<Assistant[]>(this.mock());

  readonly loading$ = this._loading.asObservable();
  readonly assistants$ = this._assistants.asObservable();

  // Derived stats
  readonly activeCount$ = this.assistants$.pipe(map(list => list.filter(a => a.isActive).length));
  readonly totalInteractions$ = this.assistants$.pipe(map(list => list.reduce((acc, a) => acc + a.totalInteractions, 0)));

  list(): Observable<Assistant[]> {
    return this.assistants$;
  }

  create(payload: AssistantForm) {
    this._loading.next(true);
    const created: Assistant = {
      id: Date.now().toString(),
      name: payload.name,
      description: payload.description,
      speechStyle: payload.speechStyle,
      serviceType: payload.serviceType,
      isActive: true,
      totalInteractions: 0,
      createdAt: new Date().toISOString()
    };
    const next = [...this._assistants.value, created];
    return of(created).pipe(
      delay(300),
      map(res => {
        this._assistants.next(next);
        this._loading.next(false);
        return res;
      })
    );
  }

  update(id: string, patch: Partial<AssistantForm>) {
    this._loading.next(true);
    const updated = this._assistants.value.map(a => a.id === id ? ({ ...a, ...patch }) as Assistant : a);
    const entity = updated.find(a => a.id === id);
    return of(entity).pipe(
      delay(300),
      map(res => {
        this._assistants.next(updated);
        this._loading.next(false);
        return res;
      })
    );
  }

  remove(id: string) {
    this._loading.next(true);
    const next = this._assistants.value.filter(a => a.id !== id);
    return of(void 0).pipe(
      delay(300),
      map(() => {
        this._assistants.next(next);
        this._loading.next(false);
      })
    );
  }

  toggle(id: string) {
    const updated = this._assistants.value.map(a =>
      a.id === id ? ({ ...a, isActive: !a.isActive }) : a
    );
    const entity = updated.find(a => a.id === id);
    this._assistants.next(updated);
    return of(entity).pipe(delay(150));
  }

  private mock(): Assistant[] {
    return [
      {
        id: '1',
        name: 'Chef AI',
        description: 'Assistente especializado em recomendações de cardápio e informações nutricionais',
        speechStyle: 'Amigável e Casual',
        serviceType: 'Cardápio',
        isActive: true,
        totalInteractions: 1250,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Atendente Virtual',
        description: 'Assistente para atendimento geral e suporte a clientes',
        speechStyle: 'Formal e Profissional',
        serviceType: 'Atendimento',
        isActive: true,
        totalInteractions: 890,
        createdAt: '2024-02-01'
      },
      {
        id: '3',
        name: 'Vendas Pro',
        description: 'Assistente focado em vendas e conversões de leads',
        speechStyle: 'Enérgico e Entusiasta',
        serviceType: 'Vendas',
        isActive: false,
        totalInteractions: 320,
        createdAt: '2024-02-15'
      }
    ];
  }
}
