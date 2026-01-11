import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import { UsersService } from './users.service';
import { UsersTableComponent } from './components/users-table';
import { UserDialogComponent } from './components/user-dialog';
import { UserFiltersComponent } from './components/user-filters';
import { UserCategoriesService, UserCategory } from './user-permissions.service';
import { UserCreateRequestDto, UserRow, UserUpdateRequestDto } from './users.models';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    UsersTableComponent,
    UserDialogComponent,
    UserFiltersComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Usuários</h1>
          <p class="text-muted-color">Gerencie sua base de usuários e seus detalhes</p>
        </div>
      </div>

      <app-user-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (exportCsv)="onExportCSV()"
        (exportPdf)="onExportPDF()"
        (deleteSelected)="onDeleteSelected()">
      </app-user-filters>

      <app-users-table
        #usersTable
        [users]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-users-table>

      <app-user-dialog
        [visible]="dialogOpen()"
        [user]="editing()"
        [categories]="categories()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-user-dialog>
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
export class UsersPage implements OnInit {
  @ViewChild('usersTable') usersTable!: UsersTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<UserRow | null>(null);

  readonly users = signal<UserRow[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<string[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  readonly categories = signal<UserCategory[]>([]);

  constructor(
    private service: UsersService,
    private categoriesService: UserCategoriesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.users$.subscribe(this.users.set);
    this.service.loading$.subscribe(this.loading.set);
    this.categoriesService.categories$.subscribe(this.categories.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
    this.categoriesService.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.users();

    return this.users().filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
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

  openEdit(s: UserRow) {
    this.service.getById(s.uuid).pipe(take(1)).subscribe({
      next: (user) => {
        this.editing.set(user);
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

  save(payload: UserCreateRequestDto | UserUpdateRequestDto) {
    const isEdit = !!this.editing();
    if (isEdit && this.editing()?.uuid) {
      this.service.update(this.editing()!.uuid, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Usuário atualizado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as UserCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Usuário criado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(s: UserRow) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(s.uuid).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', 'Usuário removido');
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
          this.toast.success('Sucesso', `${ids.length} Usuário(s) removido(s)`);
          this.selection.set([]);
          if (this.usersTable) this.usersTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }

  onExportCSV() {
    if (this.usersTable) this.usersTable.exportCSV();
  }

  onExportPDF() {
    if (this.usersTable) this.usersTable.exportPDF();
  }
}
