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
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import {
  EmployeeSchedule,
  EmployeeScheduleCreateRequestDto,
  EmployeeScheduleUpdateRequestDto
} from '../../employee-schedules.service';

@Component({
  selector: 'app-schedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
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
      [header]="schedule ? 'Editar Horário' : 'Novo Horário'"
      (onHide)="cancel.emit()"
    >
      <ng-template #content>
        <form [formGroup]="form" class="flex flex-col gap-6">

          <!-- Nome do horário -->
          <div>
            <label for="name" class="block font-bold mb-2">Nome</label>
            <input
              id="name"
              type="text"
              pInputText
              formControlName="name"
              class="w-full"
              placeholder="Ex: Manhã, Tarde, Noite"
            />
            <small
              class="text-red-500"
              *ngIf="form.get('name')?.invalid && form.get('name')?.touched"
            >
              O nome é obrigatório.
            </small>
          </div>

          <!-- Horários -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Horário início -->
            <div class="md:mb-4 sm:mb-1">
              <label for="start_time" class="block font-bold mb-2">
                Horário início
              </label>

              <p-inputMask
                inputId="start_time"
                formControlName="start_time"
                mask="99:99"
                placeholder="HH:MM"
                class="w-full"
              ></p-inputMask>

              <small class="text-red-500"
                *ngIf="form.get('start_time')?.invalid && form.get('start_time')?.touched"
              >
                Horário inicial inválido.
              </small>
            </div>

            <!-- Horário fim -->
            <div class="md:mb-4 sm:mb-1">
              <label for="end_time" class="block font-bold mb-2">
                Horário fim
              </label>

              <p-inputMask
                inputId="end_time"
                formControlName="end_time"
                mask="99:99"
                placeholder="HH:MM"
                class="w-full"
              ></p-inputMask>

              <small class="text-red-500"
                *ngIf="form.get('end_time')?.invalid && form.get('end_time')?.touched"
              >
                Horário final inválido.
              </small>
            </div>

          </div>

          <!-- Status -->
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
export class ScheduleDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() schedule: EmployeeSchedule | null = null;
  @Output() save = new EventEmitter<EmployeeScheduleCreateRequestDto | EmployeeScheduleUpdateRequestDto>();
  @Output() cancel = new EventEmitter<void>();

  statuses = [
    { name: 'Ativo', code: 1 },
    { name: 'Inativo', code: 0 }
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      status: [this.statuses[0].code, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schedule']) {
      if (this.schedule) {
        this.form.reset({
          name: this.schedule.name,
          start_time: this.schedule.start_time ?? '',
          end_time: this.schedule.end_time ?? '',
          status: this.schedule.status,
        });
      } else {
        this.form.reset({
          name: '',
          start_time: '',
          end_time: '',
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
    if (!this.schedule) {
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

  private buildPayload(): EmployeeScheduleCreateRequestDto | EmployeeScheduleUpdateRequestDto {
    const value = this.form.getRawValue();
    const normalizedEntries = Object.entries(value).reduce<Record<string, unknown>>((acc, [key, v]) => {
      acc[key] = typeof v === 'string' ? v.trim() || null : v;
      return acc;
    }, {});

    const cleaned = Object.fromEntries(
      Object.entries(normalizedEntries).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    ) as Record<string, unknown>;

    return cleaned as EmployeeScheduleCreateRequestDto | EmployeeScheduleUpdateRequestDto;
  }
}
