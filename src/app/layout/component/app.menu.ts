import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        CommonModule,
        AppMenuitem,
        RouterModule
    ],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'menu.home',
                items: [
                    { label: 'menu.dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                    {
                        label: 'menu.registrations',
                        icon: 'pi pi-fw pi-database',
                        items: [
                            { label: 'menu.customers', icon: 'pi pi-fw pi-users', routerLink: ['/customers'] },
                            { label: 'menu.suppliers', icon: 'pi pi-fw pi-building', routerLink: ['/suppliers'] },
                            { label: 'menu.carriers', icon: 'pi pi-fw pi-truck', routerLink: ['/carriers'] },
                            { label: 'menu.products', icon: 'pi pi-fw pi-box', routerLink: ['/orders'] },
                            { label: 'menu.issuers', icon: 'pi pi-fw pi-file', routerLink: ['/orders'] },
                            { label: 'menu.paymentMethods', icon: 'pi pi-fw pi-credit-card', routerLink: ['/orders'] },
                            { label: 'menu.employees', icon: 'pi pi-fw pi-sitemap', routerLink: ['/employees'] },
                            { label: 'menu.users', icon: 'pi pi-fw pi-users', routerLink: ['/orders'] },
                        ]
                    },
                    {
                        label: 'menu.sales',
                        icon: 'pi pi-fw pi-shopping-bag',
                        items: [
                            { label: 'menu.counter', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/orders'] },
                            { label: 'menu.pdv', icon: 'pi pi-fw pi-shop', routerLink: ['/orders'] },
                        ]
                    },
                    {
                        label: 'menu.tax',
                        icon: 'pi pi-fw pi-file',
                        items: [
                            { label: 'menu.nfe', icon: 'pi pi-fw pi-file-plus', routerLink: ['/orders'] },
                            { label: 'menu.taxMonitor', icon: 'pi pi-fw pi-users', routerLink: ['/orders'] },
                        ]
                    },
                    {
                        label: 'menu.finance',
                        icon: 'pi pi-fw pi-wallet',
                        items: [
                            { label: 'menu.cashier', icon: 'pi pi-fw pi-briefcase', routerLink: ['/orders'] },
                            { label: 'menu.accountsReceivable', icon: 'pi pi-fw pi-money-bill', routerLink: ['/orders'] },
                            { label: 'menu.accountsPayable', icon: 'pi pi-fw pi-calendar-times', routerLink: ['/orders'] },
                        ]
                    },
                    {
                        label: 'menu.reports',
                        icon: 'pi pi-fw pi-file-pdf',
                        items: [
                            {
                                label: 'menu.reportsCashier',
                                icon: 'pi pi-fw pi-file-pdf',
                                items: [ //test
                                    { label: 'menu.reportsReceivables', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                                    { label: 'menu.reportsReceivables', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                                    { label: 'menu.reportsReceivables', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                                ]
                            },
                            { label: 'menu.reportsReceivables', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                            { label: 'menu.reportsPayables', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                            { label: 'menu.reportsCustomers', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                            { label: 'menu.reportsProducts', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                            { label: 'menu.reportsSales', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/orders'] },
                        ]
                    },
                ]
            },
        ];
    }
}
