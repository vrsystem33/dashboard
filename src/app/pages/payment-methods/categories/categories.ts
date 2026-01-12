import { ChangeDetectionStrategy, Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs/operators';

import {
  CustomerCategoriesService,
  CustomerCategory,
  CustomerCategoryCreateRequestDto,
  CustomerCategoryUpdateRequestDto
} from '../payment-methods-categories.service';
import { ToastService } from '@app/services/toast.service';
import { CategoryFiltersComponent } from './components/category-filters';
import { CategoriesTableComponent } from './components/categories-table';
import { CategoryDialogComponent } from './components/category-dialog';

@Component({
  selector: 'app-customer-categories',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CategoryFiltersComponent,
    CategoriesTableComponent,
    CategoryDialogComponent,
    ConfirmDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold">Categorias de Clientes</h1>
          <p class="text-muted-color">Organize e mantenha as categorias dos seus clientes</p>
        </div>
      </div>

      <app-category-filters
        [search]="search()"
        [selectedCount]="selectedCount()"
        (searchChange)="search.set($event)"
        (create)="openCreate()"
        (deleteSelected)="onDeleteSelected()">
      </app-category-filters>

      <app-categories-table
        #categoriesTable
        [categories]="filtered()"
        [loading]="loading()"
        (selectionChange)="onSelectionChange($event)"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-categories-table>

      <app-category-dialog
        [visible]="dialogOpen()"
        [category]="editing()"
        (cancel)="closeDialog()"
        (save)="save($event)">
      </app-category-dialog>
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
export class CustomerCategoriesPage implements OnInit {
  @ViewChild('categoriesTable') categoriesTable!: CategoriesTableComponent;

  readonly search = signal<string>('');
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<CustomerCategory | null>(null);

  readonly categories = signal<CustomerCategory[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selection = signal<number[]>([]);
  readonly selectedCount = computed(() => this.selection().length);

  constructor(
    private service: CustomerCategoriesService,
    private confirmationService: ConfirmationService,
    private toast: ToastService
  ) {
    this.service.categories$.subscribe(this.categories.set);
    this.service.loading$.subscribe(this.loading.set);
  }

  ngOnInit(): void {
    this.service.load().pipe(take(1)).subscribe();
  }

  readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.categories();

    return this.categories().filter(category =>
      category.name.toLowerCase().includes(term) ||
      (category.description ?? '').toLowerCase().includes(term)
    );
  });

  onSelectionChange(ids: number[]) {
    this.selection.set(ids ?? []);
  }

  openCreate() {
    this.editing.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(category: CustomerCategory) {
    this.editing.set(category);
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  save(payload: CustomerCategoryCreateRequestDto | CustomerCategoryUpdateRequestDto) {
    const isEdit = !!this.editing();
    const target = this.editing();

    if (isEdit && target?.id) {
      this.service.update(target.id, payload).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Categoria atualizada');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    } else {
      this.service.create(payload as CustomerCategoryCreateRequestDto).pipe(take(1)).subscribe(() => {
        this.toast.success('Sucesso', 'Categoria criada');
        this.dialogOpen.set(false);
        this.service.load().pipe(take(1)).subscribe();
      });
    }
  }

  confirmDelete(category: CustomerCategory) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(category.id).pipe(take(1)).subscribe(() => {
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
          if (this.categoriesTable) this.categoriesTable.clearSelection();
          this.service.load().pipe(take(1)).subscribe();
        });
      }
    });
  }
}
