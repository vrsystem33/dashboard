import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DtCellTemplate } from './cell-template.directive';

/** Column definition for the generic table */
export interface DtColumn {
  /** Property to read on each row */
  field: string;
  /** Header label */
  header: string;
  /** Align content (applies to header + body) */
  align?: 'left' | 'center' | 'right';
  /** Optional width, e.g. '120px' or '20%' */
  width?: string;
  /** Enable built-in PrimeNG sorting */
  sortable?: boolean;
}

type SelectionMode = 'single' | 'multiple' | null;

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, ToolbarModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  template: `
    <div class="card">
      <p-toolbar *ngIf="showToolbar">
        <ng-template #start>
          <ng-content select="[table-toolbar-start]"></ng-content>
        </ng-template>
        <ng-template #end>
          <div class="flex items-center gap-2 flex-wrap">
            <ng-content select="[table-toolbar-end]"></ng-content>
            <p-button *ngIf="exportable" label="Export CSV" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            <p-button *ngIf="exportable && pdfExport" label="Export PDF" icon="pi pi-file-pdf" severity="secondary" (onClick)="exportPDF()" />
          </div>
        </ng-template>
      </p-toolbar>

      <p-table #dt
        [value]="value"
        [loading]="loading"
        [paginator]="paginator"
        [rows]="rows"
        [rowsPerPageOptions]="rowsPerPageOptions"
        [tableStyle]="{ 'min-width': tableMinWidth }"
        [dataKey]="dataKey"
        [responsiveLayout]="'scroll'"
        [rowHover]="true"
        [selectionMode]="selectionMode || undefined"
        [(selection)]="selection"
        (selectionChange)="selectionChange.emit(selection)"
        class="shadow-sm rounded-lg overflow-hidden"
      >
        <ng-template pTemplate="header">
          <tr>
            <th *ngIf="selectionMode" style="width:3rem">
              <p-tableHeaderCheckbox *ngIf="selectionMode === 'multiple'"></p-tableHeaderCheckbox>
            </th>
            <th *ngFor="let col of columns"
                [style.width]="col.width || null"
                [style.text-align]="col.align || 'left'"
                pSortableColumn="col.sortable ? col.field : null">
              {{ col.header }}
              <p-sortIcon *ngIf="col.sortable" [field]="col.field"></p-sortIcon>
            </th>
            <th *ngIf="hasRowActions" class="text-right" [style.width]="actionsColumnWidth"></th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-row>
          <tr>
            <td *ngIf="selectionMode">
              <ng-container [ngSwitch]="selectionMode">
                <p-tableCheckbox *ngSwitchCase="'multiple'" [value]="row"></p-tableCheckbox>
                <p-tableRadioButton *ngSwitchCase="'single'" [value]="row"></p-tableRadioButton>
              </ng-container>
            </td>

            <td *ngFor="let col of columns" [style.text-align]="col.align || 'left'">
              <ng-container *ngIf="templateMap[col.field]; else defaultCell">
                <ng-container *ngTemplateOutlet="templateMap[col.field]; context: { $implicit: row }"></ng-container>
              </ng-container>
              <ng-template #defaultCell>
                {{ resolve(row, col.field) }}
              </ng-template>
            </td>

            <td *ngIf="hasRowActions" class="text-right">
              <ng-content select="[table-row-actions]" ></ng-content>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td [attr.colspan]="columns.length + (selectionMode ? 1 : 0) + (hasRowActions ? 1 : 0)" class="text-center py-10 text-muted-color">
              {{ emptyMessage }}
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T = any> {
  /** Data rows */
  @Input() value: T[] = [];
  /** Column config */
  @Input() columns: DtColumn[] = [];
  /** Loading state */
  @Input() loading = false;

  /** Pagination */
  @Input() paginator = true;
  @Input() rows = 10;
  @Input() rowsPerPageOptions = [10, 20, 50];

  /** Selection */
  @Input() selectionMode: SelectionMode = null;
  @Input() selection: T[] | T | null = null;
  @Output() selectionChange = new EventEmitter<T[] | T | null>();
  @Input() dataKey = 'id';

  /** UI */
  @Input() showToolbar = true;
  @Input() exportable = true;
  @Input() pdfExport = true;
  @Input() emptyMessage = 'Nenhum registro encontrado';
  @Input() tableMinWidth = '800px';
  @Input() actionsColumnWidth = '10rem';
  @Input() hasRowActions = false;
  @Input() exportFilename = 'export';

  /** Collect custom cell templates declared by the parent using <ng-template dtCell="field"> */
  @ContentChildren(DtCellTemplate) cellTemplates!: QueryList<DtCellTemplate>;

  /** Map of field -> TemplateRef */
  templateMap: Record<string, TemplateRef<any>> = {} as any;

  @ViewChild('dt') dt: any;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngAfterContentInit() {
    this.templateMap = (this.cellTemplates?.toArray() || []).reduce((acc, t) => {
      if (t.field) acc[t.field] = t.template;
      return acc;
    }, {} as Record<string, TemplateRef<any>>);
  }

  /** Resolve nested properties: e.g., 'customer.name' */
  resolve(row: any, path: string) {
    return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), row);
  }

  exportCSV() {
    if (this.dt?.exportCSV) {
      this.dt.exportCSV({ selectionOnly: false, filename: this.exportFilename });
    }
  }

  exportPDF() {
    const w = window.open('', '_blank');
    if (!w) return;

    const headers = this.columns.map(c => `<th style="text-align:${c.align || 'left'}">${c.header}</th>`).join('');
    const rows = (this.value || []).map((row: any) => {
      const cells = this.columns.map(c => `<td style="text-align:${c.align || 'left'}">${this.resolve(row, c.field) ?? ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${this.exportFilename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            h1 { font-size: 18px; margin: 0 0 12px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background: #f4f4f4; text-align: left; }
          </style>
        </head>
        <body>
          <h1>${this.exportFilename}</h1>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    w.document.open(); w.document.write(html); w.document.close();
  }
}