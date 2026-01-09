import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import { SuppliersService } from './suppliers.service';
import { SuppliersTableComponent } from './components/supplier-table';
import { SupplierDialogComponent } from './components/supplier-dialog';
import { SupplierFiltersComponent } from './components/supplier-filters';
import { SupplierCategoriesService, SupplierCategory } from './supplier-categories.service';
import { SupplierCreateRequestDto, SupplierRow, SupplierUpdateRequestDto } from './suppliers.models';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    SuppliersTableComponent,
    SupplierDialogComponent,
    SupplierFiltersComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Fornecedores</h1>
          <p class="text-muted-color">Gerencie sua base de fornecedores e seus detalhes</p>
        </div>
      </div>

      <app-supplier-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (exportCsv)="onExportCSV()"
        (exportPdf)="onExportPDF()"
        (deleteSelected)="onDeleteSelected()">
      </app-supplier-filters>

      <app-suppliers-table
        #suppliersTable
        [suppliers]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-suppliers-table>

      <app-supplier-dialog
        [visible]="dialogOpen()"
        [supplier]="editing()"
        [categories]="categories()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-supplier-dialog>
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
export class SuppliersPage implements OnInit {
  @ViewChild('suppliersTable') suppliersTable!: SuppliersTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<SupplierRow | null>(null);

  readonly suppliers = signal<SupplierRow[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<string[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  readonly categories = signal<SupplierCategory[]>([]);

  constructor(
    private service: SuppliersService,
    private categoriesService: SupplierCategoriesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.suppliers$.subscribe(this.suppliers.set);
    this.service.loading$.subscribe(this.loading.set);
    this.categoriesService.categories$.subscribe(this.categories.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
    this.categoriesService.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.suppliers();

    return this.suppliers().filter(s =>
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

  openEdit(s: SupplierRow) {
    this.service.getById(s.uuid).pipe(take(1)).subscribe({
      next: (supplier) => {
        this.editing.set(supplier);
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

  save(payload: SupplierCreateRequestDto | SupplierUpdateRequestDto) {
    const isEdit = !!this.editing();
    if (isEdit && this.editing()?.uuid) {
      this.service.update(this.editing()!.uuid, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Fornecedor atualizado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as SupplierCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Fornecedor criado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(s: SupplierRow) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(s.uuid).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', 'Fornecedor removido');
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
          this.toast.success('Sucesso', `${ids.length} fornecedor(es) removido(s)`);
          this.selection.set([]);
          if (this.suppliersTable) this.suppliersTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }

  onExportCSV() {
    if (this.suppliersTable) this.suppliersTable.exportCSV();
  }

  onExportPDF() {
    if (this.suppliersTable) this.suppliersTable.exportPDF();
  }
}
