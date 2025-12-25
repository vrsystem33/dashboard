import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';

export interface ISelect {
  label: string;
  value: any;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    SelectModule,
  ],
  template: `
    <p-toolbar class="mb-6">
      <ng-template #start>
        <p-iconfield iconPosition="left" class="mr-4">
          <input
            type="text"
            pInputText
            [(ngModel)]="search"
            (ngModelChange)="searchChange.emit($event)"
            placeholder="Buscar por nome, e-mail ou telefone"
            class="w-full md:w-80"
          />
          <p-inputicon class="pi pi-search" />
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

        <button pButton class="mr-4" label="Novo Cliente" icon="pi pi-plus" (click)="create.emit()"></button>
      </ng-template>

      <ng-template #end>
        <p-button label="Export CSV" class="mr-4" icon="pi pi-upload" severity="secondary" (onClick)="exportCsv.emit()" />
        <p-button label="Export PDF" class="mr-4" icon="pi pi-file-pdf" severity="secondary" (onClick)="exportPdf.emit()" />
        <p-button severity="danger" label="Delete" icon="pi pi-trash" outlined
          (onClick)="deleteSelected.emit()"
          [disabled]="!selectedCount" />
      </ng-template>
    </p-toolbar>

    <div class="flex items-center gap-2 mb-4">
    </div>
  `
})
export class CustomerFiltersComponent {
  @Input() search = '';
  @Input() selectedCount = 0;
  @Input() status: string | null = null;
  @Input() statusOptions: ISelect[] | undefined = undefined;

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string | null>();
  @Output() create = new EventEmitter<boolean>();
  @Output() export = new EventEmitter<void>();
  @Output() deleteSelected = new EventEmitter<void>();
  @Output() exportCsv = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();
}
