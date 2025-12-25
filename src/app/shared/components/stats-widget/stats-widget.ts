// src/app/pages/dashboard/components/stats-widget.ts
import { ChangeDetectionStrategy, Component, Input, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatColor, StatItem } from './stats-widget.models';

@Component({
    selector: 'app-stats-widget',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <ng-container *ngIf="items?.length; else empty">
            <div class="grid grid-cols-12 gap-8">
                <ng-container *ngFor="let item of items; trackBy: trackByIdx">
                    <ng-container [ngTemplateOutlet]="cardTpl" [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
                </ng-container>
            </div>
        </ng-container>

        <ng-template #cardTpl let-item>
            <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                <ng-container [ngTemplateOutlet]="wrapperTpl" [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
            </div>
        </ng-template>

        <!-- Permite que o card seja <a> quando routerLink existir, senão <div> -->
        <ng-template #wrapperTpl let-item>
            <a *ngIf="item.routerLink; else staticCard"
                [routerLink]="item.routerLink"
                class="card mb-0 block no-underline">
                <ng-container [ngTemplateOutlet]="contentTpl" [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
            </a>

            <ng-template #staticCard>
                <div class="card mb-0" [attr.title]="item.tooltip || null">
                    <ng-container [ngTemplateOutlet]="contentTpl" [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
                </div>
            </ng-template>
        </ng-template>

        <!-- Conteúdo do card -->
        <ng-template #contentTpl let-item>
            <div class="flex justify-between mb-4">
                <div class="min-w-0">
                    <span class="block text-muted-color font-medium mb-2 md:mb-4 truncate">{{ item.label }}</span>

                    <!-- Valor -->
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl"
                        *ngIf="!item.loading; else skeletonValue">
                        {{ formatValue(item) }}
                    </div>
                    <ng-template #skeletonValue>
                        <div class="animate-pulse h-6 bg-surface-200 dark:bg-surface-700 rounded w-28"></div>
                    </ng-template>
                </div>

                <!-- Ícone com cor -->
                <div class="flex items-center justify-center rounded-border"
                    [ngClass]="bgClass(item.color)"
                    style="width: 2.5rem; height: 2.5rem">
                    <i class="pi text-xl!" [ngClass]="iconClass(item.icon, item.color)"></i>
                </div>
            </div>
        </ng-template>

        <ng-template #empty>
            <div class="grid grid-cols-12 gap-8">
                <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngFor="let _ of [0,1,2,3]">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div class="min-w-0">
                                <div class="animate-pulse h-4 bg-surface-200 dark:bg-surface-700 rounded w-24 mb-3"></div>
                                <div class="animate-pulse h-6 bg-surface-200 dark:bg-surface-700 rounded w-28"></div>
                            </div>
                            <div class="animate-pulse rounded-border bg-surface-200 dark:bg-surface-700" style="width: 2.5rem; height: 2.5rem"></div>
                        </div>
                        <div class="animate-pulse h-4 bg-surface-200 dark:bg-surface-700 rounded w-36"></div>
                    </div>
                </div>
            </div>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DecimalPipe, CurrencyPipe]
})
export class StatsWidget {
    /** Lista de cards */
    @Input() items: StatItem[] = [];

    constructor(
        private decimal: DecimalPipe,
        private currency: CurrencyPipe,
        @Inject(LOCALE_ID) private localeId: string
    ) { }

    trackByIdx = (_: number, __: unknown) => _;

    formatValue(item: StatItem): string {
        const f = item.format ?? { type: 'text' as const };
        const locale = f.locale || this.localeId;

        let formatted = '';
        if (typeof item.value === 'number') {
            if (f.type === 'currency') {
                const code = f.currency || 'USD';
                formatted = this.currency.transform(item.value, code, 'symbol', f.digits ?? '1.0-0', locale) ?? String(item.value);
            } else if (f.type === 'number') {
                formatted = this.decimal.transform(item.value, f.digits ?? '1.0-0', locale) ?? String(item.value);
            } else {
                formatted = String(item.value);
            }
        } else {
            formatted = String(item.value);
        }

        if (f.prefix) formatted = `${f.prefix}${formatted}`;
        if (f.suffix) formatted = `${formatted}${f.suffix}`;
        return formatted;
    }

    bgClass(color: StatColor = 'blue') {
        switch (color) {
            case 'orange': return 'bg-orange-100 dark:bg-orange-400/10';
            case 'cyan': return 'bg-cyan-100 dark:bg-cyan-400/10';
            case 'purple': return 'bg-purple-100 dark:bg-purple-400/10';
            case 'green': return 'bg-green-100 dark:bg-green-400/10';
            case 'red': return 'bg-red-100 dark:bg-red-400/10';
            case 'gray': return 'bg-surface-200 dark:bg-surface-700';
            default: return 'bg-blue-100 dark:bg-blue-400/10';
        }
    }

    iconClass(icon = 'pi-chart-line', color: StatColor = 'blue') {
        const colorClass =
            color === 'orange' ? 'text-orange-500' :
                color === 'cyan' ? 'text-cyan-500' :
                    color === 'purple' ? 'text-purple-500' :
                        color === 'green' ? 'text-green-500' :
                            color === 'red' ? 'text-red-500' :
                                color === 'gray' ? 'text-surface-600 dark:text-surface-300' :
                                    'text-blue-500';
        return [icon, colorClass];
    }
}
