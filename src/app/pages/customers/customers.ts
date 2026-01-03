import { ChangeDetectionStrategy, Component, computed, effect, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';

import { CustomersService, Customer } from './customers.service';
import { CustomersTableComponent } from './components/customers-table';
import { CustomerDialogComponent } from './components/customer-dialog';
import { CustomerFiltersComponent } from './components/customer-filters';

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
  providers: [MessageService, ConfirmationService]
})
export class CustomersPage {
  @ViewChild('customersTable') customersTable!: CustomersTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<Customer | null>(null);

  readonly customers = signal<Customer[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<Customer[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  selectedItens!: any[] | null;
  customer!: Customer;

  constructor(
    private service: CustomersService,
    private confirmationService: ConfirmationService,
    private msg: MessageService
  ) {
    this.service.customers$.subscribe(this.customers.set);
    this.service.loading$.subscribe(this.loading.set);
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

  onSelectionChange(rows: Customer[]) {
    this.selection.set(rows ?? []);
  }

  openCreate() {
    this.editing.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(c: Customer) {
    this.editing.set(c);
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  save(payload: Partial<Customer>) {
    const isEdit = !!this.editing();
    if (isEdit && this.editing()?.id) {
      this.service.update(this.editing()!.id, payload).pipe(take(1)).subscribe(() => {
        this.msg.add({ severity: 'success', summary: 'Cliente atualizado' });
        this.dialogOpen.set(false);
      });
    } else {
      this.service.create({
        name: String(payload.name ?? ''),
        email: String(payload.email ?? ''),
        phone: payload.phone,
        status: (payload.status ?? 'active') as any,
        sales: payload.sales ?? 0,
        totalSpent: payload.totalSpent ?? 0
      }).pipe(take(1)).subscribe(() => {
        this.msg.add({ severity: 'success', summary: 'Cliente criado' });
        this.dialogOpen.set(false);
      });
    }
  }

  confirmDelete(c: Customer) {
    console.log('teste')
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(c.id).pipe(take(1)).subscribe(() => {
          this.msg.add({ severity: 'success', summary: 'Cliente removido' });
        });
      }
    });
  }

  onDeleteSelected() {
    console.log('teste2')
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ${this.selection().length} selected items?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selection().map(s => s.id);

        if (!ids.length) return;

        this.service.removeMany(ids).pipe(take(1)).subscribe(() => {
          this.msg.add({ severity: 'success', summary: `${ids.length} cliente(s) removido(s)` });
          this.selection.set([]);
          if (this.customersTable) this.customersTable.clearSelection();
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
