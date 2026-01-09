import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import { CarriersService } from './carriers.service';
import { CarriersTableComponent } from './components/carrier-table';
import { CarrierDialogComponent } from './components/carrier-dialog';
import { CarrierFiltersComponent } from './components/carrier-filters';
import { CarrierCategoriesService, CarrierCategory } from './carrier-categories.service';
import { CarrierCreateRequestDto, CarrierRow, CarrierUpdateRequestDto } from './carriers.models';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-carriers',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    CarriersTableComponent,
    CarrierDialogComponent,
    CarrierFiltersComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Transportadoras</h1>
          <p class="text-muted-color">Gerencie sua base de transportadoras e seus detalhes</p>
        </div>
      </div>

      <app-carrier-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (exportCsv)="onExportCSV()"
        (exportPdf)="onExportPDF()"
        (deleteSelected)="onDeleteSelected()">
      </app-carrier-filters>

      <app-carriers-table
        #carriersTable
        [carriers]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-carriers-table>

      <app-carrier-dialog
        [visible]="dialogOpen()"
        [carrier]="editing()"
        [categories]="categories()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-carrier-dialog>
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
export class CarriersPage implements OnInit {
  @ViewChild('carriersTable') carriersTable!: CarriersTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<CarrierRow | null>(null);

  readonly carriers = signal<CarrierRow[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<string[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  readonly categories = signal<CarrierCategory[]>([]);

  constructor(
    private service: CarriersService,
    private categoriesService: CarrierCategoriesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.carriers$.subscribe(this.carriers.set);
    this.service.loading$.subscribe(this.loading.set);
    this.categoriesService.categories$.subscribe(this.categories.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
    this.categoriesService.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.carriers();

    return this.carriers().filter(c =>
      c.tradeName.toLowerCase().includes(term) ||
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

  openEdit(s: CarrierRow) {
    this.service.getById(s.uuid).pipe(take(1)).subscribe({
      next: (carrier) => {
        this.editing.set(carrier);
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

  save(payload: CarrierCreateRequestDto | CarrierUpdateRequestDto) {
    const isEdit = !!this.editing();
    if (isEdit && this.editing()?.uuid) {
      this.service.update(this.editing()!.uuid, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Transportadora atualizado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as CarrierCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Transportadora criado');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(s: CarrierRow) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(s.uuid).pipe(take(1)).subscribe(() => {
          this.toast.success('Sucesso', 'Transportadora removido');
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
          this.toast.success('Sucesso', `${ids.length} Transportadora(s) removido(s)`);
          this.selection.set([]);
          if (this.carriersTable) this.carriersTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }

  onExportCSV() {
    if (this.carriersTable) this.carriersTable.exportCSV();
  }

  onExportPDF() {
    if (this.carriersTable) this.carriersTable.exportPDF();
  }
}
