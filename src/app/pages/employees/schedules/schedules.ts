import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import {
  EmployeeSchedulesService,
  EmployeeSchedule,
  EmployeeScheduleCreateRequestDto,
  EmployeeScheduleUpdateRequestDto
} from '../employee-schedules.service';
import { ToastService } from '@app/services/toast.service';
import { ScheduleFiltersComponent } from './components/schedule-filters';
import { SchedulesTableComponent } from './components/schedules-table';
import { ScheduleDialogComponent } from './components/schedule-dialog';

@Component({
  selector: 'app-employee-schedules',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ScheduleFiltersComponent,
    SchedulesTableComponent,
    ScheduleDialogComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Horários de Trabalho</h1>
          <p class="text-muted-color">Organize e gerencie os horários de trabalho</p>
        </div>
      </div>

      <app-schedule-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (deleteSelected)="onDeleteSelected()">
      </app-schedule-filters>

      <app-schedules-table
        #schedulesTable
        [schedules]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-schedules-table>

      <app-schedule-dialog
        [visible]="dialogOpen()"
        [schedule]="editing()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-schedule-dialog>
    </div>

    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  styles: [`
    h1 {
      margin-bottom: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class EmployeeSchedulesPage implements OnInit {
  @ViewChild('schedulesTable') schedulesTable!: SchedulesTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<EmployeeSchedule | null>(null);

  readonly schedules = signal<EmployeeSchedule[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<number[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  constructor(
    private service: EmployeeSchedulesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.schedules$.subscribe(this.schedules.set);
    this.service.loading$.subscribe(this.loading.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.schedules();

    return this.schedules().filter(schedule =>
      schedule.name.toLowerCase().includes(term)
      // || (schedule.start_time ?? '').toLowerCase().includes(term)
    );
  });

  onSelectionChange(ids: number[]) {
    this.selection.set(ids ?? []);
  }

  openCreate() {
    this.editing.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(schedule: EmployeeSchedule) {
    this.editing.set(schedule);
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  save(payload: EmployeeScheduleCreateRequestDto | EmployeeScheduleUpdateRequestDto) {
    const isEdit = !!this.editing();
    const target = this.editing();

    if (isEdit && target?.id) {
      this.service.update(target.id, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Categoria atualizada');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as EmployeeScheduleCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Categoria criada');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(schedule: EmployeeSchedule) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(schedule.id).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', 'Categoria removida');
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }

  onDeleteSelected() {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ${this.selection().length} selected items?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selection();

        if (!ids.length) return;

        this.service.removeMany(ids).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', `${ids.length} categoria(s) removida(s)`);
          this.selection.set([]);
          if (this.schedulesTable) this.schedulesTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }
}
