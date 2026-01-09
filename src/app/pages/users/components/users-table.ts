import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, LOCALE_ID, Output, signal, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { UserRow } from '../users.models';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    TableModule,
    ButtonModule,
    TagModule,
    // CurrencyPipe,
  ],
  template: `
    <div class="card">
      <p-table
        #dt
        [value]="users"
        dataKey="uuid"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10,20,50]"
        [loading]="loading"
        [lazy]="false"
        class="shadow-sm rounded-lg overflow-hidden users-table"
        [tableStyle]="{'min-width':'800px'}"
        responsiveLayout="scroll"
        [globalFilterFields]="['name', 'email', 'phone', 'status']"
        [(selection)]="selected"
        selectionMode="multiple"
        (selectionChange)="onSelectionChange($event)"
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
            <th pSortableColumn="categoryName">
              Categoria
              <p-sortIcon field="categoryName" />
            </th>
            <th class="actions">Ações</th>
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
                [severity]="c.status ? 'success' : 'danger'"
                [value]="c.status ? 'Ativo' : 'Inativo'
              "></p-tag>
            </td>
            <td>{{ c.categoryName }}</td>
            <td class="actions">
              <button pButton icon="pi pi-pencil" class="p-button-text" (click)="edit.emit(c)"></button>
              <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="delete.emit(c)"></button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="py-10 text-muted-color" style="text-align: center !important;">
              Nenhum Usuário encontrado
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dataview *ngIf="mobile()" [value]="users" layout="list">
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
                  <p-tag [severity]="c.status ? 'success' : 'danger'" [value]="c.status ? 'Ativo' : 'Inativo'"></p-tag>
                </div>
                <div class="flex justify-between items-center">
                  <span>{{ c.categoryName }}</span>
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
  styles: `
    /* Alinhamento vertical consistente */
    .users-table {

      .p-datatable-thead > tr > th,
      .p-datatable-tbody > tr > td {
        vertical-align: middle;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
      }

      /* Header: alinhar texto + sort icon */
      .p-datatable-thead > tr > th {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      /* Evita que o sort icon empurre o texto */
      .p-sortable-column {
        justify-content: flex-start;
      }

      /* Tags (Status) */
      .p-tag {
        line-height: 1;
        padding: 0.25rem 0.5rem;
      }

      /* Coluna de ações */
      td.actions,
      th.actions {
        text-align: center;
      }

      td.actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent {
  @ViewChild('dt') dt?: Table;

  @Input() users: UserRow[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<UserRow>();
  @Output() delete = new EventEmitter<UserRow>();
  @Output() selectionChange = new EventEmitter<string[]>();

  selected: string[] = [];
  currencyCode = 'BRL';
  mobile = signal(false);

  constructor(@Inject(LOCALE_ID) public locale: string) {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile() {
    this.mobile.set(window.innerWidth < 768);
  }

  onSelectionChange(selected: any[]) {
    const uuids = selected.map(c => c.uuid);
    this.selectionChange.emit(uuids);
  }

  exportCSV() {
    if (!this.dt) return console.error('Tabela ainda não inicializada');
    this.dt.exportCSV();
  }

  exportPDF() {
    try {
      const w = window.open('', '_blank');
      if (!w) return;

      const rows = this.users.map(s => `
        <tr>
          <td>${s.name}</td>
          <td>${s.email}</td>
          <td>${s.phone ?? '-'}</td>
          <td>${s.status ? 'Ativo' : 'Inativo'}</td>
          <td style="text-align:right">${s.categoryName}</td>
        </tr>
      `).join('');

      const html = `
        <html>
          <head>
            <title>Usuários</title>
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
            <h1>Usuários</h1>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th style="text-align:right">Categoria</th>
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
