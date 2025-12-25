import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-order-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, ToolbarModule, SelectModule],
  template: `
      <p-toolbar class="my-8">
        <ng-template #start>
          <div class="flex flex-col gap-3 md:flex-row md:items-center">
            <p-iconfield>
              <p-inputicon styleClass="pi pi-search" />
              <input
                type="text"
                pInputText
                [(ngModel)]="search"
                (ngModelChange)="searchChange.emit($event)"
                placeholder="Buscar por cliente, ID, item..."
                class="w-72 md:w-96"
              />
            </p-iconfield>

            <p-select
              [(ngModel)]="status"
              (onChange)="statusChange.emit($event.value)"
              [options]="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Status"
              styleClass="w-48"
            />
          </div>
        </ng-template>

        <ng-template #end>
          <div class="flex gap-3 flex-wrap justify-end">
            <p-button label="Export CSV" icon="pi pi-upload" severity="secondary" (onClick)="exportCsv.emit()" />
            <p-button label="Export PDF" icon="pi pi-file-pdf" severity="secondary" (onClick)="exportPdf.emit()" />
            <p-button label="Delete" icon="pi pi-trash" severity="danger" outlined
              (onClick)="deleteSelected.emit()"
              [disabled]="!selectedCount" />
          </div>
        </ng-template>
      </p-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderFiltersComponent {
  @Input() search = '';
  @Output() searchChange = new EventEmitter<string>();

  @Input() status: string | null = null;
  @Output() statusChange = new EventEmitter<string | null>();

  @Input() selectedCount = 0;
  @Output() exportCsv = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();
  @Output() deleteSelected = new EventEmitter<void>();

  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Pendente', value: 'pending' },
    { label: 'Em Preparo', value: 'preparing' },
    { label: 'Pronto', value: 'ready' },
    { label: 'Entregue', value: 'delivered' },
    { label: 'Cancelado', value: 'cancelled' },
  ];
}