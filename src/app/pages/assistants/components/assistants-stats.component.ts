import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-assistants-stats',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <p-card class="dashboard-card">
        <ng-template pTemplate="content">
          <div class="flex items-center gap-3">
            <i class="pi pi-robot text-primary text-2xl"></i>
            <div>
              <p class="text-sm text-muted-color">Total de Assistentes</p>
              <p class="text-2xl font-bold">{{ total }}</p>
            </div>
          </div>
        </ng-template>
      </p-card>

      <p-card class="dashboard-card">
        <ng-template pTemplate="content">
          <div class="flex items-center gap-3">
            <i class="pi pi-power text-green-500 text-2xl"></i>
            <div>
              <p class="text-sm text-muted-color">Assistentes Ativos</p>
              <p class="text-2xl font-bold">{{ active }}</p>
            </div>
          </div>
        </ng-template>
      </p-card>

      <p-card class="dashboard-card">
        <ng-template pTemplate="content">
          <div class="flex items-center gap-3">
            <i class="pi pi-comments text-yellow-500 text-2xl"></i>
            <div>
              <p class="text-sm text-muted-color">Total de Interações</p>
              <p class="text-2xl font-bold">{{ interactions | number }}</p>
            </div>
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistantsStatsComponent {
  @Input() total = 0;
  @Input() active = 0;
  @Input() interactions = 0;
}
