import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import {
  EmployeeCategory,
  EmployeeCategoryCreateRequestDto,
  EmployeeCategoryUpdateRequestDto
} from '../../employee-categories.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '95vw', maxWidth: '520px' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="true"
      [header]="category ? 'Editar Categoria' : 'Nova Categoria'"
      (onHide)="cancel.emit()"
    >
      <ng-template #content>
        <form [formGroup]="form" class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-2">Nome</label>
            <input id="name" type="text" pInputText formControlName="name" class="w-full" placeholder="Digite o nome" />
            <small class="text-red-500" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              O nome é obrigatório.
            </small>
          </div>

          <div>
            <label for="description" class="block font-bold mb-2">Descrição</label>
            <input
              id="description"
              type="text"
              pInputText
              formControlName="description"
              class="w-full"
              placeholder="Descreva a categoria"
            />
          </div>

          <div>
            <label for="status" class="block font-bold mb-2">Status</label>
            <p-select
              inputId="status"
              formControlName="status"
              [options]="statuses"
              optionLabel="name"
              optionValue="code"
              placeholder="Selecione o status"
              class="w-full"
              appendTo="body"
            />
          </div>
        </form>
      </ng-template>

      <ng-template #footer>
        <p-button label="Cancelar" icon="pi pi-times" text (click)="onCloseForm()" />
        <p-button label="Salvar" icon="pi pi-check" (click)="onSave()" [disabled]="form.invalid" />
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() category: EmployeeCategory | null = null;
  @Output() save = new EventEmitter<EmployeeCategoryCreateRequestDto | EmployeeCategoryUpdateRequestDto>();
  @Output() cancel = new EventEmitter<void>();

  statuses = [
    { name: 'Ativo', code: 1 },
    { name: 'Inativo', code: 0 }
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      status: [this.statuses[0].code, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      if (this.category) {
        this.form.reset({
          name: this.category.name,
          description: this.category.description ?? '',
          status: this.category.status,
        });
      } else {
        this.form.reset({
          name: '',
          description: '',
          status: true,
        });
      }
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.buildPayload());
  }

  onCloseForm() {
    if (!this.category) {
      this.form.reset({
        name: '',
        description: '',
        status: true,
      });

      this.form.markAsPristine();
      this.form.markAsUntouched();
    }

    this.cancel.emit();
  }

  private buildPayload(): EmployeeCategoryCreateRequestDto | EmployeeCategoryUpdateRequestDto {
    const value = this.form.getRawValue();
    const normalizedEntries = Object.entries(value).reduce<Record<string, unknown>>((acc, [key, v]) => {
      acc[key] = typeof v === 'string' ? v.trim() || null : v;
      return acc;
    }, {});

    const cleaned = Object.fromEntries(
      Object.entries(normalizedEntries).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    ) as Record<string, unknown>;

    return cleaned as EmployeeCategoryCreateRequestDto | EmployeeCategoryUpdateRequestDto;
  }
}
