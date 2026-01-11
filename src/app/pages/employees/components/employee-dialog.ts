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
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';

import { take } from 'rxjs/operators';

import { ToastService } from '@app/services/toast.service';
import { EmployeeCreateRequestDto, EmployeeRow, EmployeeUpdateRequestDto } from '../employees.models';
import { RoleDialogComponent } from '../roles/components/role-dialog';
import { ScheduleDialogComponent } from '../schedules/components/schedule-dialog';
import {
  EmployeeRolesService,
  EmployeeRole,
  EmployeeRoleCreateRequestDto,
  EmployeeRoleUpdateRequestDto
} from '../employee-roles.service';
import {
  EmployeeSchedule,
  EmployeeScheduleCreateRequestDto,
  EmployeeSchedulesService,
  EmployeeScheduleUpdateRequestDto
} from '../employee-schedules.service';


@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    PanelModule,
    RoleDialogComponent,
    ScheduleDialogComponent,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '95vw', maxWidth: '600px' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="true"
      [header]="employee ? 'Editar Funcionário' : 'Novo Funcionário'"
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
            <label for="role" class="block font-bold mb-2">Função</label>
            <div class="flex gap-2 items-center">
              <p-select
                inputId="role"
                formControlName="role_id"
                [options]="roles"
                optionLabel="name"
                optionValue="id"
                placeholder="Selecione a Função"
                class="w-full"
                appendTo="body"
              />
              <button
                pButton
                type="button"
                label="Nova função"
                icon="pi pi-plus"
                class="p-button-outlined shrink-0"
                (click)="openRoleDialog()"
              ></button>
            </div>
            <small class="text-red-500" *ngIf="form.get('role_id')?.invalid && form.get('role_id')?.touched">
              A função é obrigatória.
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

          <div class="md:col-span-1">
            <label class="block font-bold mb-2" for="salary">Salário</label>
            <p-inputnumber
              id="salary"
              formControlName="salary"
              placeholder="Informe o salário"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              fluid
            />
          </div>

          <div>
            <label for="schedule" class="block font-bold mb-2">Horário de Trabalho</label>
            <div class="flex gap-2 items-center">
              <p-select
                inputId="schedule"
                formControlName="schedule_id"
                [options]="schedules"
                optionLabel="name"
                optionValue="uuid"
                placeholder="Selecione o Horário"
                class="w-full"
                appendTo="body"
              />
              <button
                pButton
                type="button"
                label="Novo Horário"
                icon="pi pi-plus"
                class="p-button-outlined shrink-0"
                (click)="openScheduleDialog()"
              ></button>
            </div>
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

    <app-role-dialog
      [visible]="roleDialogVisible"
      [role]="null"
      (cancel)="closeRoleDialog()"
      (save)="createRole($event)">
    </app-role-dialog>

    <app-schedule-dialog
      [visible]="scheduleDialogVisible"
      [schedule]="null"
      (cancel)="closeScheduleDialog()"
      (save)="createSchedule($event)">
    </app-schedule-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() employee: EmployeeRow | null = null;
  @Input() roles: EmployeeRole[] = [];
  @Input() schedules: EmployeeSchedule[] = [];

  @Output() save = new EventEmitter<EmployeeCreateRequestDto | EmployeeUpdateRequestDto>();
  @Output() cancel = new EventEmitter<void>();

  statuses = [
    { name: 'Ativo', code: true },
    { name: 'Inativo', code: false }
  ];

  showMoreInfo: boolean = true;
  roleDialogVisible: boolean = false;
  scheduleDialogVisible: boolean = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rolesService: EmployeeRolesService,
    private schedulesService: EmployeeSchedulesService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role_id: [null, Validators.required],
      status: [true, Validators.required],
      salary: [null],
      schedule_id: [null],
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
    if (changes['employee']) {
      console.log("🚀 ~ EmployeeDialogComponent ~ ngOnChanges ~ this.employee:", this.employee)
      if (this.employee) {
        this.form.reset({
          name: this.employee.name,
          email: this.employee.email,
          phone: this.employee.phone ?? '',
          role_id: this.employee.role_id ?? null,
          schedule_id: this.employee.schedule_id ?? null,
          salary: this.employee.salary ?? null,
          status: this.employee.status,
          last_name: this.employee.last_name ?? '',
          nickname: this.employee.nickname ?? '',
          identification: this.employee.identification ?? '',
          secondary_phone: this.employee.secondary_phone ?? '',
          postal_code: this.employee.postal_code ?? '',
          address: this.employee.address ?? '',
          number: this.employee.number ?? '',
          neighborhood: this.employee.neighborhood ?? '',
          complement: this.employee.complement ?? '',
          city: this.employee.city ?? '',
          state: this.employee.state ?? '',
        });
      } else {
        this.form.reset({
          name: '',
          email: '',
          phone: '',
          role_id: null,
          schedule_id: null,
          salary: null,
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

    if (!this.employee) {
      // ✅ RESET PROFISSIONAL
      this.form.reset({
        name: '',
        role_id: null,
        schedule_id: null,
      });

      // fecha seções extras
      this.showMoreInfo = true;

      // evita estados "dirty" residuais
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  onCloseForm() {
    if (this.employee) {
      return this.cancel.emit()
    }

    this.form.reset({
      name: '',
      role_id: null,
      schedule_id: null,
    });

    this.showMoreInfo = true;

    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.cancel.emit()
  }

  openRoleDialog() {
    this.roleDialogVisible = true;
  }

  closeRoleDialog() {
    this.roleDialogVisible = false;
  }

  openScheduleDialog() {
    this.scheduleDialogVisible = true;
  }

  closeScheduleDialog() {
    this.scheduleDialogVisible = false;
  }

  createRole(payload: EmployeeRoleCreateRequestDto | EmployeeRoleUpdateRequestDto) {
    this.rolesService.create(payload as EmployeeRoleCreateRequestDto).pipe(take(1)).subscribe({
      next: (role) => {
        this.toast.success('Sucesso', 'Categoria criada');
        this.roleDialogVisible = false;
        if (role?.id) {
          this.form.patchValue({ role_id: role.id });
        }
        this.rolesService.load().pipe(take(1)).subscribe();
      },
      error: (e) => {
        this.toast.error('Error', e);
      }
    });
  }

  createSchedule(payload: EmployeeScheduleCreateRequestDto | EmployeeScheduleUpdateRequestDto) {
    this.schedulesService.create(payload as EmployeeScheduleCreateRequestDto).pipe(take(1)).subscribe({
      next: (schedule) => {
        this.toast.success('Sucesso', 'Categoria criada');
        this.scheduleDialogVisible = false;
        if (schedule?.id) {
          this.form.patchValue({ schedule_id: schedule.id });
        }
        this.schedulesService.load().pipe(take(1)).subscribe();
      },
      error: (e) => {
        this.toast.error('Error', e);
      }
    });
  }

  private buildPayload(): EmployeeCreateRequestDto | EmployeeUpdateRequestDto {
    const value = this.form.getRawValue();
    const normalizedEntries = Object.entries(value).reduce<Record<string, unknown>>((acc, [key, v]) => {
      acc[key] = typeof v === 'string' ? v.trim() || null : v;
      return acc;
    }, {});

    const cleaned = Object.fromEntries(
      Object.entries(normalizedEntries).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    ) as Record<string, any>;

    return cleaned as EmployeeCreateRequestDto | EmployeeUpdateRequestDto;
  }
}
