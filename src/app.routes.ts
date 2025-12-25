import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from '@app/guards/auth.guard';
import { Settings } from '@app/pages/settings/settings';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'settings', component: Settings },
            { path: 'customers', loadComponent: () => import('@app/pages/customers/customers').then(m => m.CustomersPage) },
            { path: 'orders', loadComponent: () => import('@app/pages/orders/orders').then(m => m.OrdersPage) },
            { path: 'assistants', loadComponent: () => import('@app/pages/assistants/assistants').then(m => m.AssistantsPage) },
        ],
        canActivate: [AuthGuard]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
