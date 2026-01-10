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
  selector: 'app-schedule-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    MenuModule
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
            placeholder="Buscar por nome"
            class="w-full md:w-80"
          />
          <p-inputicon class="pi pi-search" />
        </p-iconfield>

        <button pButton class="mr-4" label="Novo Horário" icon="pi pi-plus" (click)="create.emit()"></button>
        <button pButton type="button" label="Funcionários" icon="pi pi-sitemap" class="p-button-outlined shrink-0" (click)="this.openEmployees()"></button>
      </ng-template>

      <ng-template #end>
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
          placeholder="Buscar horário"
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
export class ScheduleFiltersComponent {
  @Input() search = '';
  @Input() selectedCount = 0;

  @Output() searchChange = new EventEmitter<string>();
  @Output() create = new EventEmitter<boolean>();
  @Output() deleteSelected = new EventEmitter<void>();

  @ViewChild('actionsMenu') actionsMenu!: Menu;

  mobileActions = [
    {
      label: 'Funcionários',
      icon: 'pi pi-tags',
      command: () => this.openEmployees()
    },
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

  openEmployees() {
    void this.router.navigate(['/employees']);
  }
}
