import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { Assistant, ServiceType, SpeechStyle, SERVICE_TYPES, SPEECH_STYLES } from '../assistants.model';
import { AssistantCardComponent } from './assistant-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assistants-list',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, SelectModule, CardModule, AssistantCardComponent],
  template: `
    <div class="card">
      <div class="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div class="flex items-center gap-2 flex-1">
          <span class="p-input-icon-left w-full md:w-80">
            <i class="pi pi-search"></i>
            <input pInputText [placeholder]="'Buscar assistentes...'" class="w-full" [ngModel]="search" (ngModelChange)="searchChange.emit($event)" />
          </span>

          <p-select [options]="serviceOptions"
                      [ngModel]="serviceType"
                      (onChange)="serviceTypeChange.emit($event.value)"
                      placeholder="Tipo"
                      optionLabel="label"
                      optionValue="value"
                      [showClear]="true"
                      styleClass="min-w-40"></p-select>

          <p-select [options]="speechOptions"
                      [ngModel]="speechStyle"
                      (onChange)="speechStyleChange.emit($event.value)"
                      placeholder="Estilo"
                      optionLabel="label"
                      optionValue="value"
                      [showClear]="true"
                      styleClass="min-w-40"></p-select>
        </div>

        <button pButton type="button" label="Novo Assistente" icon="pi pi-plus" (click)="create.emit()"></button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngIf="items.length === 0" class="col-span-full text-center py-8 text-muted-color">
          <i class="pi pi-robot text-3xl block mb-3"></i>
          Nenhum assistente encontrado.
        </div>

        <app-assistant-card
          *ngFor="let a of items"
          [assistant]="a"
          (edit)="edit.emit($event)"
          (remove)="remove.emit($event)"
          (toggle)="toggle.emit($event)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistantsListComponent {
  @Input() items: Assistant[] = [];
  @Input() search = '';
  @Input() serviceType: ServiceType | null = null;
  @Input() speechStyle: SpeechStyle | null = null;

  @Output() searchChange = new EventEmitter<string>();
  @Output() serviceTypeChange = new EventEmitter<ServiceType | null>();
  @Output() speechStyleChange = new EventEmitter<SpeechStyle | null>();
  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Assistant>();
  @Output() remove = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

  serviceOptions = SERVICE_TYPES.map(v => ({ label: v, value: v }));
  speechOptions = SPEECH_STYLES.map(v => ({ label: v, value: v }));
}
