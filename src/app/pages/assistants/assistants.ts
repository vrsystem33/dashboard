import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AssistantsService } from './assistants.service';
import { Assistant, AssistantForm, ServiceType, SpeechStyle } from './assistants.model';
import { AssistantsStatsComponent } from './components/assistants-stats.component';
import { AssistantsListComponent } from './components/assistants-list.component';
import { AssistantFormComponent } from './components/assistant-form.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-assistants',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    AssistantsStatsComponent,
    AssistantsListComponent,
    AssistantFormComponent
  ],
  template: `
    <p-toast></p-toast>

    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold">Assistentes IA</h1>
          <p class="text-muted-color">Gerencie seus assistentes virtuais</p>
        </div>
        <button pButton type="button" label="Novo Assistente" icon="pi pi-plus" (click)="openCreate()"></button>
      </div>

      <app-assistants-stats
        [total]="total()"
        [active]="active()"
        [interactions]="interactions()"
      ></app-assistants-stats>

      <app-assistants-list
        [items]="filtered()"
        [search]="search()"
        [serviceType]="serviceType()"
        [speechStyle]="speechStyle()"
        (searchChange)="search.set($event)"
        (serviceTypeChange)="serviceType.set($event)"
        (speechStyleChange)="speechStyle.set($event)"
        (create)="openCreate()"
        (edit)="openEdit($event)"
        (remove)="onRemove($event)"
        (toggle)="onToggle($event)"
      ></app-assistants-list>

      <app-assistant-form
        [visible]="dialogOpen()"
        [value]="editing()"
        (cancel)="closeDialog()"
        (save)="onSave($event)"
      ></app-assistant-form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class AssistantsPage {
  private readonly svc = inject(AssistantsService);
  private readonly msg = inject(MessageService);

  // UI state with signals
  readonly dialogOpen = signal<boolean>(false);
  readonly editing = signal<Assistant | null>(null);
  readonly search = signal<string>('');
  readonly serviceType = signal<ServiceType | null>(null);
  readonly speechStyle = signal<SpeechStyle | null>(null);

  // data
  readonly assistants = signal<Assistant[]>([]);
  readonly total = computed(() => this.assistants().length);

  readonly active = signal<number>(0);
  readonly interactions = signal<number>(0);

  constructor() {
    this.svc.list().subscribe(list => this.assistants.set(list));
    this.svc.activeCount$.subscribe(n => this.active.set(n));
    this.svc.totalInteractions$.subscribe(n => this.interactions.set(n));
  }

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const type = this.serviceType();
    const style = this.speechStyle();
    return this.assistants().filter(a => {
      const matchQ = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.serviceType.toLowerCase().includes(q);
      const matchType = !type || a.serviceType === type;
      const matchStyle = !style || a.speechStyle === style;
      return matchQ && matchType && matchStyle;
    });
  });

  openCreate() {
    this.editing.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(a: Assistant) {
    this.editing.set(a);
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  onSave(payload: AssistantForm) {
    const editing = this.editing();
    if (editing) {
      this.svc.update(editing.id, payload).subscribe(() => {
        this.msg.add({ severity: 'success', summary: 'Assistente atualizado' });
        this.closeDialog();
      });
    } else {
      this.svc.create(payload).subscribe(() => {
        this.msg.add({ severity: 'success', summary: 'Assistente criado' });
        this.closeDialog();
      });
    }
  }

  onRemove(id: string) {
    if (confirm('Tem certeza que deseja excluir este assistente?')) {
      self.setTimeout(() => { }, 0); // no-op to keep type happy in isolated env
      this.svc.remove(id).subscribe(() => {
        this.msg.add({ severity: 'success', summary: 'Assistente excluído' });
      });
    }
  }

  onToggle(id: string) {
    this.svc.toggle(id).subscribe(entity => {
      if (!entity) return;
      this.msg.add({
        severity: 'info',
        summary: `Assistente ${entity.isActive ? 'ativado' : 'desativado'}`
      });
    });
  }
}
