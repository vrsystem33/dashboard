import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, LOCALE_ID, Output, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Order, OrderStatus } from '../orders.service';

type BadgeSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    BadgeModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="card">
      <p-table
        #dt
        [value]="orders"
        dataKey="id"
        selectionMode="multiple"
        [(selection)]="selected"
        (selectionChange)="selectionChange.emit(selected)"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10,20,50]"
        [loading]="loading"
        [tableStyle]="{'min-width':'900px'}"
        responsiveLayout="scroll"
        class="shadow-sm rounded-lg overflow-hidden"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width:3rem">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th>ID</th>
            <th>Cliente</th>
            <th>Itens</th>
            <th>Status</th>
            <th>Total</th>
            <th>Data</th>
            <th class="text-right">Ações</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-order>
          <tr>
            <td><p-tableCheckbox [value]="order"></p-tableCheckbox></td>
            <td class="font-mono">#{{ order.id }}</td>
            <td class="font-medium">{{ order.customerName }}</td>
            <td>
              <div *ngFor="let item of order.items" class="text-sm">
                {{ item.quantity }}x {{ item.name }}
              </div>
            </td>
            <td>
              <p-badge [value]="getStatusConfig(order.status).label"
                       [severity]="getStatusConfig(order.status).severity"></p-badge>
            </td>
            <td>{{ order.total | currency:currencyCode:'symbol':'1.2-2':locale }}</td>
            <td>{{ order.createdAt | date:'dd/MM/yyyy HH:mm':locale }}</td>
            <td class="text-right">
              <p-select
                *ngIf="order.status !== 'delivered' && order.status !== 'cancelled'"
                [options]="statusOptions"
                [ngModel]="order.status"
                (onChange)="statusChange.emit({id: order.id, status: $event.value})"
                optionLabel="name"
                styleClass="w-44" />
              <button pButton type="button" icon="pi pi-eye" class="p-button-outlined p-button-sm ml-2"></button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr><td colspan="8" class="text-center py-10 text-muted-color">Nenhum pedido encontrado</td></tr>
        </ng-template>
      </p-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersTableComponent {
  @Input() orders: Order[] = [];
  @Input() loading = false;
  @Input() currencyCode = 'BRL';

  @Output() selectionChange = new EventEmitter<Order[]>();
  @Output() statusChange = new EventEmitter<{ id: string; status: OrderStatus }>();

  @ViewChild('dt') dt: any;
  selected: Order[] = [];

  constructor(@Inject(LOCALE_ID) public locale: string) { }

  statusOptions = [
    { name: 'Pendente', code: 'pending' },
    { name: 'Em Preparo', code: 'preparing' },
    { name: 'Pronto', code: 'ready' },
    { name: 'Entregue', code: 'delivered' },
    { name: 'Cancelado', code: 'cancelled' }
  ];

  getStatusConfig(status: OrderStatus): { label: string; severity: BadgeSeverity } {
    switch (status) {
      case 'pending': return { label: 'Pendente', severity: 'warn' };
      case 'preparing': return { label: 'Em Preparo', severity: 'info' };
      case 'ready': return { label: 'Pronto', severity: 'success' };
      case 'delivered': return { label: 'Entregue', severity: 'success' };
      case 'cancelled': return { label: 'Cancelado', severity: 'danger' };
      default: return { label: status, severity: 'secondary' };
    }
  }

  exportCSV() {
    if (!this.dt) return;
    this.dt.exportCSV();
  }

  exportPDF() {
    const w = window.open('', '_blank');
    if (!w) return;
    const rows = this.orders.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${o.customerName}</td>
        <td>${o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
        <td>${this.getStatusConfig(o.status).label}</td>
        <td style="text-align:right">${new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currencyCode }).format(o.total)}</td>
        <td>${new Date(o.createdAt).toLocaleString(this.locale)}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Pedidos</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            h1 { font-size: 18px; margin: 0 0 12px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background: #f4f4f4; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Pedidos</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Status</th>
                <th>Total</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    w.document.open(); w.document.write(html); w.document.close();
  }

  clearSelection() { this.selected = []; }
}