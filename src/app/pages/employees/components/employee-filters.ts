import { Component, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { Menu, MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-employee-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    MenuModule,
  ],
  template: `
    <p-toolbar class="mb-6 md:flex" *ngIf="!mobile()">
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

        <button pButton class="mr-4" label="Novo Funcionário" icon="pi pi-plus" (click)="create.emit()"></button>

        <button pButton type="button" label="Todas Categorias" icon="pi pi-tags" class="p-button-outlined shrink-0" (click)="this.openCategories()"></button>
      </ng-template>

      <ng-template #end>
        <p-button label="Export CSV" class="mr-4" icon="pi pi-upload" severity="secondary" (onClick)="exportCsv.emit()" />
        <p-button label="Export PDF" class="mr-4" icon="pi pi-file-pdf" severity="secondary" (onClick)="exportPdf.emit()" />
        <p-button severity="danger" label="Delete" icon="pi pi-trash" outlined
          (onClick)="deleteSelected.emit()"
          [disabled]="!selectedCount" />
      </ng-template>
    </p-toolbar>

    <div class="md:hidden mb-4 flex flex-col gap-3">
      <!-- Busca -->
      <p-iconfield iconPosition="left">
        <input
          pInputText
          [(ngModel)]="search"
          (ngModelChange)="searchChange.emit($event)"
          placeholder="Buscar cliente"
          class="w-full"
        />
        <p-inputicon class="pi pi-search" />
      </p-iconfield>

      <!-- Ações principais -->
      <div class="flex gap-2">
        <button
          pButton
          label="Novo"
          icon="pi pi-plus"
          class="flex-1"
          (click)="create.emit()">
        </button>

        <button
          pButton
          icon="pi pi-ellipsis-v"
          class="p-button-outlined"
          (click)="toggleActions($event)">
        </button>
      </div>

    </div>

    <p-menu #actionsMenu [popup]="true" [model]="mobileActions"></p-menu>
  `
})
export class EmployeeFiltersComponent {
  @Input() search = '';
  @Input() selectedCount = 0;

  @Output() searchChange = new EventEmitter<string>();
  @Output() create = new EventEmitter<boolean>();
  @Output() export = new EventEmitter<void>();
  @Output() deleteSelected = new EventEmitter<void>();
  @Output() exportCsv = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();

  @ViewChild('actionsMenu') actionsMenu!: Menu;

  mobileActions = [
    {
      label: 'Categorias',
      icon: 'pi pi-tags',
      command: () => this.openCategories()
    },
    {
      label: 'Exportar CSV',
      icon: 'pi pi-upload',
      command: () => this.exportCsv.emit()
    },
    {
      label: 'Exportar PDF',
      icon: 'pi pi-file-pdf',
      command: () => this.exportPdf.emit()
    },
    // {
    //   separator: true
    // },
    // {
    //   label: 'Excluir selecionados',
    //   icon: 'pi pi-trash',
    //   disabled: !this.selectedCount,
    //   command: () => this.deleteSelected.emit()
    // }
  ];

  mobile = signal(false);

  constructor(private readonly router: Router) {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile() {
    this.mobile.set(window.innerWidth < 768);
  }

  toggleActions(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.actionsMenu) {
      return;
    }

    this.actionsMenu.toggle(event);
  }

  openCategories() {
    void this.router.navigate(['/employees/categories']);
  }
}
