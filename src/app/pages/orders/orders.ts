import { ChangeDetectionStrategy, Component, LOCALE_ID, Inject, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';

import { OrdersService, Order, OrderStatus } from './orders.service';
import { OrdersTableComponent } from './components/orders-table';
import { OrderFiltersComponent } from './components/order-filters';

import { StatsWidget } from 'src/app/shared/components/stats-widget/stats-widget';
import { take } from 'rxjs/operators';
import { StatItem } from '@app/shared/components/stats-widget/stats-widget.models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ToolbarModule,
    StatsWidget,
    OrderFiltersComponent,
    OrdersTableComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Pedidos</h1>
          <p class="text-muted-color">Gerencie todos os pedidos do sistema</p>
        </div>
      </div>

      <app-stats-widget [items]="stats()"></app-stats-widget>

      <app-order-filters
        [search]="search()"
        (searchChange)="search.set($event)"
        [status]="statusFilter()"
        (statusChange)="statusFilter.set($event)"
        [selectedCount]="selectedCount()"
        (exportCsv)="onExportCSV()"
        (exportPdf)="onExportPDF()"
        (deleteSelected)="onDeleteSelected()"
      ></app-order-filters>

      <app-orders-table
        #ordersTable
        [orders]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (statusChange)="onChangeStatus($event)"
      ></app-orders-table>
    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class OrdersPage {
  @ViewChild('ordersTable') ordersTable!: OrdersTableComponent;

  readonly search = signal<string>('');
  readonly statusFilter = signal<string | null>(null);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<Order[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  constructor(
    private service: OrdersService,
    private msg: MessageService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.service.orders$.subscribe(this.orders.set);
    this.service.loading$.subscribe(this.loading.set);
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();
    const st = this.statusFilter();
    let data = this.orders();
    if (st) data = data.filter(o => o.status === st);
    if (term) {
      data = data.filter(o =>
        o.id.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.items.some(i => i.name.toLowerCase().includes(term))
      );
    }
    return data;
  });

  readonly stats = computed<StatItem[]>(() => {
    const all = this.orders();
    const total = all.reduce((acc, o) => acc + o.total, 0);
    const pending = all.filter(o => o.status === 'pending').length;
    const preparing = all.filter(o => o.status === 'preparing').length;
    const delivered = all.filter(o => o.status === 'delivered').length;

    return [
      {
        label: 'Pedidos (Hoje)',
        value: all.length,
        icon: 'pi-shopping-cart',
        color: 'blue',
        format: { type: 'number' }
      },
      {
        label: 'Receita',
        value: total,
        icon: 'pi-dollar',
        color: 'green',
        format: { type: 'currency', currency: this.currencyCode, digits: '1.2-2', locale: this.locale }
      },
      {
        label: 'Pendentes',
        value: pending,
        icon: 'pi-hourglass',
        color: 'orange',
        format: { type: 'number' }
      },
      {
        label: 'Entregues',
        value: delivered,
        icon: 'pi-check-circle',
        color: 'purple',
        format: { type: 'number' }
      }
    ];
  });

  currencyCode = 'BRL';

  onSelectionChange(rows: Order[]) {
    this.selection.set(rows ?? []);
  }

  onChangeStatus(evt: { id: string; status: OrderStatus }) {
    this.service.setStatus(evt.id, evt.status).pipe(take(1)).subscribe(() => {
      this.msg.add({ severity: 'success', summary: 'Status atualizado' });
    });
  }

  onExportCSV() {
    this.ordersTable?.exportCSV();
  }

  onExportPDF() {
    // self = this
    // this.ordersTable?.exportPDF();
  }

  onDeleteSelected() {
    const ids = this.selection().map(s => s.id);
    if (!ids.length) return;
    this.service.removeMany(ids).pipe(take(1)).subscribe(() => {
      this.msg.add({ severity: 'success', summary: `${ids.length} pedido(s) removido(s)` });
      this.selection.set([]);
      this.ordersTable?.clearSelection();
    });
  }
}