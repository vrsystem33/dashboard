import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import { EmployeesService } from './employees.service';
import { EmployeesTableComponent } from './components/employee-table';
import { EmployeeDialogComponent } from './components/employee-dialog';
import { EmployeeFiltersComponent } from './components/employee-filters';
import { EmployeeCategoriesService, EmployeeCategory } from './employee-categories.service';
import { EmployeeCreateRequestDto, EmployeeRow, EmployeeUpdateRequestDto } from './employees.models';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    EmployeesTableComponent,
    EmployeeDialogComponent,
    EmployeeFiltersComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Funcionários</h1>
          <p class="text-muted-color">Gerencie sua base de funcionários e seus detalhes</p>
        </div>
      </div>

      <app-employee-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (exportCsv)="onExportCSV()"
        (exportPdf)="onExportPDF()"
        (deleteSelected)="onDeleteSelected()">
      </app-employee-filters>

      <app-employees-table
        #employeesTable
        [employees]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-employees-table>

      <app-employee-dialog
        [visible]="dialogOpen()"
        [employee]="editing()"
        [categories]="categories()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-employee-dialog>
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
export class EmployeesPage implements OnInit {
  @ViewChild('employeesTable') employeesTable!: EmployeesTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<EmployeeRow | null>(null);

  readonly employees = signal<EmployeeRow[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<string[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  readonly categories = signal<EmployeeCategory[]>([]);

  constructor(
    private service: EmployeesService,
    private categoriesService: EmployeeCategoriesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.employees$.subscribe(this.employees.set);
    this.service.loading$.subscribe(this.loading.set);
    this.categoriesService.categories$.subscribe(this.categories.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
    this.categoriesService.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.employees();

    return this.employees().filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      (s.roleName ?? '').toLowerCase().includes(term) ||
      (s.phone ?? '').toLowerCase().includes(term)
    );
  });

  onSelectionChange(rows: string[]) {
    this.selection.set(rows ?? []);
  }

  openCreate() {
    this.editing.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(s: EmployeeRow) {
    this.service.getById(s.uuid).pipe(take(1)).subscribe({
      next: (employee) => {
        this.editing.set(employee);
        this.dialogOpen.set(true);
      },
      error: (e) => {
        this.toast.error('Error', e);
      },
    });
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  save(payload: EmployeeCreateRequestDto | EmployeeUpdateRequestDto) {
    const isEdit = !!this.editing();
    if (isEdit && this.editing()?.uuid) {
      this.service.update(this.editing()!.uuid, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Funcionário atualizado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as EmployeeCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Funcionário criado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(s: EmployeeRow) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(s.uuid).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', 'Funcionário removido');
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
          this.toast.success('Sucesso', `${ids.length} Funcionário(s) removido(s)`);
          this.selection.set([]);
          if (this.employeesTable) this.employeesTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }

  onExportCSV() {
    if (this.employeesTable) this.employeesTable.exportCSV();
  }

  onExportPDF() {
    if (this.employeesTable) this.employeesTable.exportPDF();
  }
}
