import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { Assistant, AssistantForm, SERVICE_TYPES, SPEECH_STYLES } from '../assistants.model';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-assistant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '95vw', maxWidth: '720px' }"
      [header]="value ? 'Editar Assistente' : 'Novo Assistente'"
      (onHide)="cancel.emit()"
    >
      <form [formGroup]="form" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium">Nome do Assistente</label>
            <input pInputText type="text" formControlName="name" placeholder="Ex: Chef AI, Atendente..." class="w-full"/>
            <small class="text-red-500" *ngIf="form.controls['name'].touched && form.controls['name'].invalid">Nome é obrigatório.</small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium">Tipo de Atendimento</label>
            <p-select formControlName="serviceType"
                        [options]="serviceTypeOptions"
                        [filter]="true"
                        placeholder="Selecione o tipo"
                        optionLabel="label"
                        optionValue="value"
                        appendTo="body"
                        class="w-full"></p-select>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium">Descrição</label>
          <textarea pTextarea rows="3" formControlName="description" placeholder="Descreva a função e especialidade..." class="w-full"></textarea>
          <small class="text-red-500" *ngIf="form.controls['description'].touched && form.controls['description'].invalid">Descrição é obrigatória.</small>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium">Estilo de Fala</label>
            <p-select formControlName="speechStyle"
                        [options]="speechStyleOptions"
                        placeholder="Selecione o estilo"
                        optionLabel="label"
                        optionValue="value"
                        appendTo="body"
                        class="w-full"></p-select>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-2">
          <button pButton type="button" label="Cancelar" class="p-button-text" (click)="cancel.emit()"></button>
          <button pButton type="button" label="Salvar" [disabled]="form.invalid" (click)="onSubmit()"></button>
        </div>
      </form>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistantFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() value: Assistant | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<AssistantForm>();

  form: FormGroup;

  serviceTypeOptions = SERVICE_TYPES.map(v => ({ label: v, value: v }));
  speechStyleOptions = SPEECH_STYLES.map(v => ({ label: v, value: v }));

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      speechStyle: [SPEECH_STYLES[0], Validators.required],
      serviceType: [SERVICE_TYPES[0], Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      if (this.value) {
        this.form.reset({
          name: this.value.name,
          description: this.value.description,
          speechStyle: this.value.speechStyle,
          serviceType: this.value.serviceType
        });
      } else {
        this.form.reset({
          name: '',
          description: '',
          speechStyle: this.speechStyleOptions[0].value,
          serviceType: this.serviceTypeOptions[0].value
        });
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.save.emit(this.form.getRawValue());
  }
}
