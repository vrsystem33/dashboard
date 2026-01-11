import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import {
  EmployeeRolesService,
  EmployeeRole,
  EmployeeRoleCreateRequestDto,
  EmployeeRoleUpdateRequestDto
} from '../employee-roles.service';
import { ToastService } from '@app/services/toast.service';
import { RoleFiltersComponent } from './components/role-filters';
import { RolesTableComponent } from './components/roles-table';
import { RoleDialogComponent } from './components/role-dialog';

@Component({
  selector: 'app-employee-roles',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    RoleFiltersComponent,
    RolesTableComponent,
    RoleDialogComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Funções de Funcionários</h1>
          <p class="text-muted-color">Organize e gerencie todas as funções de funcionários</p>
        </div>
      </div>

      <app-role-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (deleteSelected)="onDeleteSelected()">
      </app-role-filters>

      <app-roles-table
        #rolesTable
        [roles]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-roles-table>

      <app-role-dialog
        [visible]="dialogOpen()"
        [role]="editing()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-role-dialog>
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
export class EmployeeRolesPage implements OnInit {
  @ViewChild('rolesTable') rolesTable!: RolesTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<EmployeeRole | null>(null);

  readonly roles = signal<EmployeeRole[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<number[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  constructor(
    private service: EmployeeRolesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.roles$.subscribe(this.roles.set);
    this.service.loading$.subscribe(this.loading.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.roles();

    return this.roles().filter(role =>
      role.name.toLowerCase().includes(term) ||
      (role.description ?? '').toLowerCase().includes(term)
    );
  });

  onSelectionChange(ids: number[]) {
    this.selection.set(ids ?? []);
  }

  openCreate() {
    this.editing.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(role: EmployeeRole) {
    this.editing.set(role);
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  save(payload: EmployeeRoleCreateRequestDto | EmployeeRoleUpdateRequestDto) {
    const isEdit = !!this.editing();
    const target = this.editing();

    if (isEdit && target?.id) {
      this.service.update(target.id, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Função atualizada');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as EmployeeRoleCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Função criada');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(role: EmployeeRole) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(role.id).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', 'Função removida');
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
          this.toast.success('Sucesso', `${ids.length} item(s) removida(s)`);
          this.selection.set([]);
          if (this.rolesTable) this.rolesTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }
}
