import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
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
            { path: 'customers', loadChildren: () => import('@app/pages/customers/customers.routes') },
            { path: 'suppliers', loadChildren: () => import('@app/pages/suppliers/suppliers.routes') },
            { path: 'carriers', loadChildren: () => import('@app/pages/carriers/carriers.routes') },
            { path: 'products', loadChildren: () => import('@app/pages/carriers/carriers.routes') },
            { path: 'issuers', loadChildren: () => import('@app/pages/carriers/carriers.routes') },
            { path: 'payment-methods', loadChildren: () => import('@app/pages/payment-methods/payment-methods.routes') },
            { path: 'employees', loadChildren: () => import('@app/pages/employees/employees.routes') },
            { path: 'users', loadChildren: () => import('@app/pages/users/users.routes') },


            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'settings', component: Settings },
            { path: 'sales', loadComponent: () => import('@app/pages/orders/orders').then(m => m.OrdersPage) },
            { path: 'assistants', loadComponent: () => import('@app/pages/assistants/assistants').then(m => m.AssistantsPage) },

            // { path: 'customers/categories', loadComponent: () => import('@app/pages/customers/categories/categories').then(m => m.CustomerCategoriesPage) },
        ],
        canActivate: [AuthGuard]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
