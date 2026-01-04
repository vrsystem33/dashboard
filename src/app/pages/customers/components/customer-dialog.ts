import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
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
import { CustomersService, Customer } from '../customers.service';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '95vw', maxWidth: '600px' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="true"
      [header]="customer ? 'Editar Cliente' : 'Novo Cliente'"
      (onHide)="cancel.emit()"
    >
      <ng-template #content>
        <form [formGroup]="form" class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-2">Nome completo</label>
            <input id="name" type="text" pInputText formControlName="name" class="w-full" placeholder="Digite o nome" />
            <small class="text-red-500" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              O nome é obrigatório e deve ter pelo menos 2 caracteres.
            </small>
          </div>

          <div>
            <label for="email" class="block font-bold mb-2">E-mail</label>
            <input id="email" type="email" pInputText formControlName="email" class="w-full" placeholder="Digite o e-mail" />
            <small class="text-red-500" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Informe um e-mail válido.
            </small>
          </div>

          <div>
            <label for="phone" class="block font-bold mb-2">Telefone</label>
            <input id="phone" type="text" pInputText formControlName="phone" class="w-full" placeholder="(99) 99999-9999" />
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
        <p-button label="Cancelar" icon="pi pi-times" text (click)="cancel.emit()" />
        <p-button label="Salvar" icon="pi pi-check" (click)="onSave()" [disabled]="form.invalid" />
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() customer: Customer | null = null;
  @Output() save = new EventEmitter<Partial<Customer>>();
  @Output() cancel = new EventEmitter<void>();

  statuses = [
    { name: 'Ativo', code: true },
    { name: 'Inativo', code: false }
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      status: [true, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer']) {
      if (this.customer) {
        this.form.reset({
          name: this.customer.name,
          email: this.customer.email,
          phone: this.customer.phone ?? '',
          status: this.customer.status
        });
      } else {
        this.form.reset({
          name: '',
          email: '',
          phone: '',
          status: 'active'
        });
      }
    }
  }

  onSave() {
    if (this.form.invalid) return;
    this.save.emit(this.form.getRawValue());
  }
}