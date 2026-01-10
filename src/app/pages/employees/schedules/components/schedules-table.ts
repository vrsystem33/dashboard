import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { EmployeeSchedule } from '../../employee-schedules.service';

@Component({
  selector: 'app-schedules-table',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    TableModule,
    ButtonModule,
    TagModule,
  ],
  template: `
    <div class="card">
      <p-table
        #dt
        [value]="schedules"
        dataKey="id"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10,20,50]"
        [loading]="loading"
        [lazy]="false"
        class="shadow-sm rounded-lg overflow-hidden schedules-table"
        [tableStyle]="{'min-width':'700px'}"
        responsiveLayout="scroll"
        [globalFilterFields]="['name', 'description', 'status']"
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
            <th pSortableColumn="start_time">
              Horário Inicio
              <p-sortIcon field="start_time" />
            </th>
            <th pSortableColumn="end_time">
              Horário Fim
              <p-sortIcon field="end_time" />
            </th>
            <th pSortableColumn="status">
              Status
              <p-sortIcon field="status" />
            </th>
            <th class="actions">Ações</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-schedule>
          <tr>
            <td style="width: 3rem">
              <p-tableCheckbox [value]="schedule" />
            </td>
            <td>{{ schedule.name }}</td>
            <td>{{ schedule.start_time || '-' }}</td>
            <td>{{ schedule.end_time || '-' }}</td>
            <td>
              <p-tag
                [severity]="schedule.status ? 'success' : 'danger'"
                [value]="schedule.status ? 'Ativo' : 'Inativo'"
              ></p-tag>
            </td>
            <td class="actions">
              <button pButton icon="pi pi-pencil" class="p-button-text" (click)="edit.emit(schedule)"></button>
              <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="delete.emit(schedule)"></button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr><td colspan="5" class="py-10 text-muted-color" style="text-align: center !important;">Nenhuma horário encontrada</td></tr>
        </ng-template>
      </p-table>

      <p-dataview *ngIf="mobile()" [value]="schedules" layout="list">
        <ng-template let-items #list>
          <div class="flex flex-col">
            <div *ngFor="let schedule of items; let i = index">
              <div class="p-4 border-b border-surface flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-bold">{{ schedule.name }}</div>
                    <div class="text-sm text-muted">{{ schedule.description || '-' }}</div>
                  </div>
                  <p-tag [severity]="schedule.status ? 'success' : 'danger'" [value]="schedule.status ? 'Ativo' : 'Inativo'"></p-tag>
                </div>
                <div class="flex gap-2 justify-end">
                  <button pButton icon="pi pi-pencil" class="p-button-text" (click)="edit.emit(schedule)"></button>
                  <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="delete.emit(schedule)"></button>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </p-dataview>
    </div>
  `,
  styles: `
    .schedules-table {
      .p-datatable-thead > tr > th,
      .p-datatable-tbody > tr > td {
        vertical-align: middle;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
      }

      .p-datatable-thead > tr > th {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .p-sortable-column {
        justify-content: flex-start;
      }

      .p-tag {
        line-height: 1;
        padding: 0.25rem 0.5rem;
      }

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
export class SchedulesTableComponent {
  @ViewChild('dt') dt?: Table;

  @Input() schedules: EmployeeSchedule[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<EmployeeSchedule>();
  @Output() delete = new EventEmitter<EmployeeSchedule>();
  @Output() selectionChange = new EventEmitter<number[]>();

  selected: EmployeeSchedule[] = [];
  mobile = signal(false);

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile() {
    this.mobile.set(window.innerWidth < 768);
  }

  onSelectionChange(selected: EmployeeSchedule[]) {
    const ids = selected.map(schedule => schedule.id);
    this.selectionChange.emit(ids);
  }

  clearSelection() {
    this.selected = [];
  }
}
