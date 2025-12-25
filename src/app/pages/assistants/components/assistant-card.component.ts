import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Assistant } from '../assistants.model';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assistant-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToggleSwitchModule,
    FormsModule
  ],
  template: `
    <p-card class="dashboard-card">
      <ng-template pTemplate="content">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i class="pi pi-robot text-white text-lg"></i>
            </div>
            <div>
              <h3 class="font-semibold text-lg">{{ assistant.name }}</h3>
              <p-tag [value]="assistant.serviceType" [severity]="serviceTypeSeverity(assistant.serviceType)"></p-tag>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <p-toggleswitch [ngModel]="assistant.isActive" (onChange)="toggle.emit(assistant.id)"></p-toggleswitch>
          </div>
        </div>

        <p class="text-sm text-muted-color mb-4 line-clamp-2">
          {{ assistant.description }}
        </p>

        <div class="space-y-2 mb-4 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-color">Estilo:</span>
            <span class="font-medium">{{ assistant.speechStyle }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-color">Interações:</span>
            <span class="font-medium">{{ assistant.totalInteractions | number }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-color">Status:</span>
            <p-tag [severity]="assistant.isActive ? 'success' : 'secondary'"
                   [value]="assistant.isActive ? 'Ativo' : 'Inativo'"></p-tag>
          </div>
        </div>

        <div class="flex gap-2">
          <button pButton type="button" icon="pi pi-pencil" label="Editar" class="p-button-outlined p-button-sm flex-1" (click)="edit.emit(assistant)"></button>
          <button pButton type="button" icon="pi pi-trash" class="p-button-outlined p-button-sm p-button-danger" (click)="remove.emit(assistant.id)"></button>
        </div>
      </ng-template>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistantCardComponent {
  @Input() assistant!: Assistant;
  @Output() edit = new EventEmitter<Assistant>();
  @Output() remove = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

  serviceTypeSeverity(type: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, any> = {
      'Cardápio': 'success',
      'Atendimento': 'info',
      'Suporte Técnico': 'warning',
      'Vendas': 'danger',
      'Informações Gerais': 'secondary'
    };
    return map[type] ?? 'secondary';
  }
}
