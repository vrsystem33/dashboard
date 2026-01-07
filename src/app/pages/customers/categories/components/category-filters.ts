import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-category-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
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
            placeholder="Buscar por nome ou descrição"
            class="w-full md:w-80"
          />
          <p-inputicon class="pi pi-search" />
        </p-iconfield>

        <button pButton class="mr-4" label="Nova Categoria" icon="pi pi-plus" (click)="create.emit()"></button>
      </ng-template>

      <ng-template #end>
        <p-button severity="danger" label="Delete" icon="pi pi-trash" outlined
          (onClick)="deleteSelected.emit()"
          [disabled]="!selectedCount" />
      </ng-template>
    </p-toolbar>
  `
})
export class CategoryFiltersComponent {
  @Input() search = '';
  @Input() selectedCount = 0;

  @Output() searchChange = new EventEmitter<string>();
  @Output() create = new EventEmitter<boolean>();
  @Output() deleteSelected = new EventEmitter<void>();
}
