import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import { CustomersService } from './customers.service';
import { CustomersTableComponent } from './components/customers-table';
import { CustomerDialogComponent } from './components/customer-dialog';
import { CustomerFiltersComponent } from './components/customer-filters';
import { CustomerCategoriesService, CustomerCategory } from './customer-categories.service';
import { CustomerCreateRequestDto, CustomerRow, CustomerUpdateRequestDto } from './customers.models';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    CustomersTableComponent,
    CustomerDialogComponent,
    CustomerFiltersComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Clientes</h1>
          <p class="text-muted-color">Gerencie sua base de clientes e seus detalhes</p>
        </div>
      </div>

      <app-customer-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (exportCsv)="onExportCSV()"
        (exportPdf)="onExportPDF()"
        (deleteSelected)="onDeleteSelected()">
      </app-customer-filters>

      <app-customers-table
        #customersTable
        [customers]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-customers-table>

      <app-customer-dialog
        [visible]="dialogOpen()"
        [customer]="editing()"
        [categories]="categories()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-customer-dialog>
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
export class CustomersPage implements OnInit {
  @ViewChild('customersTable') customersTable!: CustomersTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<CustomerRow | null>(null);

  readonly customers = signal<CustomerRow[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<string[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  readonly categories = signal<CustomerCategory[]>([]);

  constructor(
    private service: CustomersService,
    private categoriesService: CustomerCategoriesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.customers$.subscribe(this.customers.set);
    this.service.loading$.subscribe(this.loading.set);
    this.categoriesService.categories$.subscribe(this.categories.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
    this.categoriesService.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.customers();

    return this.customers().filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.phone ?? '').toLowerCase().includes(term)
    );
  });

  onSelectionChange(rows: string[]) {
    this.selection.set(rows ?? []);
  }

  openCreate() {
    this.editing.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(c: CustomerRow) {
    this.editing.set(c);
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  save(payload: CustomerCreateRequestDto | CustomerUpdateRequestDto) {
    const isEdit = !!this.editing();
    if (isEdit && this.editing()?.uuid) {
      this.service.update(this.editing()!.uuid, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Cliente atualizado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as CustomerCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Cliente criado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(c: CustomerRow) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(c.uuid).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', 'Cliente removido');
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
          this.toast.success('Sucesso', `${ids.length} cliente(s) removido(s)`);
          this.selection.set([]);
          if (this.customersTable) this.customersTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }

  onExportCSV() {
    if (this.customersTable) this.customersTable.exportCSV();
  }

  onExportPDF() {
    if (this.customersTable) this.customersTable.exportPDF();
  }
}
