import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * Usage in parent:
 * <ng-template dtCell="status" let-row>
 *   <!-- custom cell rendering for 'status' column -->
 * </ng-template>
 */
@Directive({
  selector: 'ng-template[dtCell]',
  standalone: true
})
export class DtCellTemplate {
  @Input('dtCell') field!: string;
  constructor(public readonly template: TemplateRef<any>) {}
}