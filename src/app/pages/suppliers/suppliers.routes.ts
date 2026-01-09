import { Routes } from '@angular/router';

import { SuppliersPage } from './suppliers';
import { SupplierCategoriesPage } from './categories/categories';

export default [
    { path: '', component: SuppliersPage },
    { path: 'categories', component: SupplierCategoriesPage }
] as Routes;
