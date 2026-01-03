import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, LOCALE_ID, Output, signal, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CustomersService, Customer } from '../customers.service';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    TableModule,
    ButtonModule,
    TagModule,
    CurrencyPipe,
  ],
  template: `
    <div class="card">
      <p-table
        #dt
        [value]="customers"
        dataKey="id"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10,20,50]"
        [loading]="loading"
        [lazy]="false"
        class="shadow-sm rounded-lg overflow-hidden"
        [tableStyle]="{'min-width':'800px'}"
        responsiveLayout="scroll"
        [globalFilterFields]="['name', 'email', 'phone', 'status']"
        [(selection)]="selected"
        selectionMode="multiple"
        (selectionChange)="selectionChange.emit(selected)"
        *ngIf="!mobile()"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem">
              <p-tableHeaderCheckbox />
            </th>
            <th pSortableColumn="name">
              Nome
              <p-sortIcon field="name" />
            </th>
            <th pSortableColumn="email">
              Email
              <p-sortIcon field="email" />
            </th>
            <th pSortableColumn="phone">
              Telefone
              <p-sortIcon field="phone" />
            </th>
            <th pSortableColumn="status">
              Status
              <p-sortIcon field="status" />
            </th>
            <th pSortableColumn="sales">
              Vendas
              <p-sortIcon field="sales" />
            </th>
            <th pSortableColumn="totalSpent">
              Total Gasto
              <p-sortIcon field="totalSpent" />
            </th>
            <th>Ações</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-c>
          <tr>
            <td style="width: 3rem">
              <p-tableCheckbox [value]="c" />
            </td>
            <td>{{ c.name }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.phone || '-' }}</td>
            <td>
              <p-tag
                [severity]="c.status === 'active' ? 'success' : 'danger'"
                [value]="c.status === 'active' ? 'Ativo' : 'Inativo'
              "></p-tag>
            </td>
            <td>{{ c.sales }}</td>
            <td>{{ c.totalSpent | currency:'BRL':'symbol-narrow':'1.2-2' }}</td>
            <td class="flex gap-2">
              <button pButton icon="pi pi-pencil" class="p-button-text" (click)="edit.emit(c)"></button>
              <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="delete.emit(c)"></button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr><td colspan="8" class="text-center py-10 text-muted-color">Nenhum cliente encontrado</td></tr>
        </ng-template>
      </p-table>

      <p-dataview *ngIf="mobile()" [value]="customers" layout="list">
        <ng-template let-items #list>
          <div class="flex flex-col">
            <div *ngFor="let c of items; let i = index">
              <div class="p-4 border-b border-surface flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-bold">{{ c.name }}</div>
                    <div class="text-sm text-muted">{{ c.email }}</div>
                    <div class="text-sm text-muted">{{ c.phone || '-' }}</div>
                  </div>
                  <p-tag [severity]="c.status === 'active' ? 'success' : 'danger'" [value]="c.status === 'active' ? 'Ativo' : 'Inativo'"></p-tag>
                </div>
                <div class="flex justify-between items-center">
                  <span>{{ c.sales }} pedidos</span>
                  <span>{{ c.totalSpent | currency:'BRL':'symbol-narrow':'1.2-2' }}</span>
                </div>
                <div class="flex gap-2 justify-end">
                  <button pButton icon="pi pi-pencil" class="p-button-text" (click)="edit.emit(c)"></button>
                  <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="delete.emit(c)"></button>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </p-dataview>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersTableComponent {
  @ViewChild('dt') dt: any;

  @Input() customers: Customer[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Customer>();
  @Output() delete = new EventEmitter<Customer>();
  @Output() selectionChange = new EventEmitter<Customer[]>();

  selected: Customer[] = [];
  currencyCode = 'BRL';
  mobile = signal(false);

  constructor(@Inject(LOCALE_ID) public locale: string) {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile() {
    this.mobile.set(window.innerWidth < 768);
  }

  exportCSV() {
    if (!this.dt) return console.error('Tabela ainda não inicializada');
    this.dt.exportCSV();
  }

  exportPDF() {
    try {
      const w = window.open('', '_blank');
      if (!w) return;

      const rows = this.customers.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.email}</td>
          <td>${c.phone ?? '-'}</td>
          <td>${c.status === 'active' ? 'Ativo' : 'Inativo'}</td>
          <td style="text-align:right">${c.sales}</td>
          <td style="text-align:right">${new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currencyCode }).format(c.totalSpent)}</td>
        </tr>
      `).join('');

      const html = `
        <html>
          <head>
            <title>Clientes</title>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial, sans-serif; padding: 16px; }
              h1 { font-size: 18px; margin: 0 0 12px 0; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background: #f4f4f4; text-align: left; }
            </style>
          </head>
          <body>
            <h1>Clientes</h1>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th style="text-align:right">Pedidos</th>
                  <th style="text-align:right">Total Gasto</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `;

      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (e) {
      console.error('Falha ao exportar PDF', e);
    }
  }

  clearSelection() {
    this.selected = [];
  }
}
