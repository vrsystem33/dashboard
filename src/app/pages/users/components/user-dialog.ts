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
import { PanelModule } from 'primeng/panel';
import { UserCreateRequestDto, UserRow, UserUpdateRequestDto } from '../users.models';
import { take } from 'rxjs/operators';
import { CategoryDialogComponent } from '../permissions/components/permission-dialog';
import {
  UserCategoriesService,
  UserCategory,
  UserCategoryCreateRequestDto,
  UserCategoryUpdateRequestDto
} from '../user-permissions.service';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    PanelModule,
    CategoryDialogComponent,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '95vw', maxWidth: '600px' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="true"
      [header]="user ? 'Editar Usuário' : 'Novo Usuário'"
      (onHide)="cancel.emit()"
    >
      <ng-template #content>
        <form [formGroup]="form" class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-2">Nome completo</label>
            <input id="name" type="text" pInputText formControlName="name" class="w-full" placeholder="Digite o nome" />
            <small class="text-red-500" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              O nome é obrigatório e deve ter pelo menos 3 caracteres.
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
            <label for="category" class="block font-bold mb-2">Categoria</label>
            <div class="flex gap-2 items-center">
              <p-select
                inputId="category"
                formControlName="category_id"
                [options]="categories"
                optionLabel="name"
                optionValue="id"
                placeholder="Selecione a categoria"
                class="w-full"
                appendTo="body"
              />
              <button
                pButton
                type="button"
                label="Nova categoria"
                icon="pi pi-plus"
                class="p-button-outlined shrink-0"
                (click)="openCategoryDialog()"
              ></button>
            </div>
            <small class="text-red-500" *ngIf="form.get('category_id')?.invalid && form.get('category_id')?.touched">
              A categoria é obrigatória.
            </small>
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

          <p-panel header="Mais informações" toggleable [collapsed]="showMoreInfo">
            <div class="flex flex-col gap-4">

              <fieldset class="border border-surface rounded-md p-4">
                <legend class="px-2 text-sm font-semibold text-primary">
                  Informações pessoais
                </legend>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:mb-4 sm:mb-1">
                    <label class="block font-bold mb-2" for="last_name">Sobrenome</label>
                    <input id="last_name" type="text" pInputText formControlName="last_name" class="w-full" />
                  </div>
                  <div class="md:mb-4 sm:mb-1">
                    <label class="block font-bold mb-2" for="nickname">Apelido</label>
                    <input id="nickname" type="text" pInputText formControlName="nickname" class="w-full" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block font-bold mb-2" for="identification">Documento</label>
                    <input id="identification" type="text" pInputText formControlName="identification" class="w-full" />
                  </div>

                  <div>
                    <label class="block font-bold mb-2" for="secondary_phone">Telefone secundário</label>
                    <input id="secondary_phone" type="text" pInputText formControlName="secondary_phone" class="w-full" />
                  </div>
                </div>
              </fieldset>

              <fieldset class="border border-surface rounded-md p-4">
                <legend class="px-2 text-sm font-semibold text-primary">
                  Endereço
                </legend>

                <div class="md:mb-4 sm:mb-1">
                  <label class="block font-bold mb-2" for="address">Endereço</label>
                  <input id="address" type="text" pInputText formControlName="address" class="w-full" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:mb-4 sm:mb-1">
                    <label class="block font-bold mb-2" for="number">Número</label>
                    <input id="number" type="text" pInputText formControlName="number" class="w-full" />
                  </div>

                  <div class="md:mb-4 sm:mb-1">
                    <label class="block font-bold mb-2" for="postal_code">CEP</label>
                    <input id="postal_code" type="text" pInputText formControlName="postal_code" class="w-full" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:mb-4 sm:mb-1">
                    <label class="block font-bold mb-2" for="neighborhood">Bairro</label>
                    <input id="neighborhood" type="text" pInputText formControlName="neighborhood" class="w-full" />
                  </div>

                  <div class="md:mb-4 sm:mb-1">
                    <label class="block font-bold mb-2" for="complement">Complemento</label>
                    <input id="complement" type="text" pInputText formControlName="complement" class="w-full" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block font-bold mb-2" for="city">Cidade</label>
                    <input id="city" type="text" pInputText formControlName="city" class="w-full" />
                  </div>

                  <div>
                    <label class="block font-bold mb-2" for="state">Estado</label>
                    <input id="state" type="text" pInputText formControlName="state" class="w-full" />
                  </div>
                </div>
              </fieldset>
            </div>
          </p-panel>
        </form>
      </ng-template>

      <ng-template #footer>
        <p-button label="Cancelar" icon="pi pi-times" text (click)="onCloseForm()" />
        <p-button label="Salvar" icon="pi pi-check" (click)="onSave()" [disabled]="form.invalid" />
      </ng-template>
    </p-dialog>

    <app-category-dialog
      [visible]="categoryDialogVisible"
      [category]="null"
      (cancel)="closeCategoryDialog()"
      (save)="createCategory($event)">
    </app-category-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() user: UserRow | null = null;
  @Input() categories: UserCategory[] = [];
  @Output() save = new EventEmitter<UserCreateRequestDto | UserUpdateRequestDto>();
  @Output() cancel = new EventEmitter<void>();

  statuses = [
    { name: 'Ativo', code: true },
    { name: 'Inativo', code: false }
  ];

  public showMoreInfo: boolean = true;
  categoryDialogVisible = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoriesService: UserCategoriesService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      category_id: [null, Validators.required],
      status: [true, Validators.required],
      last_name: [''],
      nickname: [''],
      identification: [''],
      secondary_phone: [''],
      postal_code: [''],
      address: [''],
      number: [''],
      neighborhood: [''],
      complement: [''],
      city: [''],
      state: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      if (this.user) {
        this.form.reset({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone ?? '',
          category_id: this.user.category_id ?? null,
          status: this.user.status,
          last_name: this.user.last_name ?? '',
          nickname: this.user.nickname ?? '',
          identification: this.user.identification ?? '',
          secondary_phone: this.user.secondary_phone ?? '',
          postal_code: this.user.postal_code ?? '',
          address: this.user.address ?? '',
          number: this.user.number ?? '',
          neighborhood: this.user.neighborhood ?? '',
          complement: this.user.complement ?? '',
          city: this.user.city ?? '',
          state: this.user.state ?? '',
        });
      } else {
        this.form.reset({
          name: '',
          email: '',
          phone: '',
          category_id: null,
          status: true,
          last_name: '',
          nickname: '',
          identification: '',
          secondary_phone: '',
          postal_code: '',
          address: '',
          number: '',
          neighborhood: '',
          complement: '',
          city: '',
          state: '',
        });
      }
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    this.save.emit(payload);

    if (!this.user) {
      // ✅ RESET PROFISSIONAL
      this.form.reset({
        name: '',
        category_id: null,
      });

      // fecha seções extras
      this.showMoreInfo = true;

      // evita estados "dirty" residuais
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  onCloseForm() {
    if (this.user) {
      return this.cancel.emit()
    }

    this.form.reset({
      name: '',
      category_id: null,
    });

    this.showMoreInfo = true;

    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.cancel.emit()
  }

  openCategoryDialog() {
    this.categoryDialogVisible = true;
  }

  closeCategoryDialog() {
    this.categoryDialogVisible = false;
  }

  createCategory(payload: UserCategoryCreateRequestDto | UserCategoryUpdateRequestDto) {
    this.categoriesService.create(payload as UserCategoryCreateRequestDto).pipe(take(1)).subscribe({
      next: (category) => {
        this.toast.success('Sucesso', 'Categoria criada');
        this.categoryDialogVisible = false;
        if (category?.id) {
          this.form.patchValue({ category_id: category.id });
        }
        this.categoriesService.load().pipe(take(1)).subscribe();
      },
      error: (e) => {
        this.toast.error('Error', e);
      }
    });
  }

  private buildPayload(): UserCreateRequestDto | UserUpdateRequestDto {
    const value = this.form.getRawValue();
    const normalizedEntries = Object.entries(value).reduce<Record<string, unknown>>((acc, [key, v]) => {
      acc[key] = typeof v === 'string' ? v.trim() || null : v;
      return acc;
    }, {});

    const cleaned = Object.fromEntries(
      Object.entries(normalizedEntries).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    ) as Record<string, any>;

    return cleaned as UserCreateRequestDto | UserUpdateRequestDto;
  }
}
