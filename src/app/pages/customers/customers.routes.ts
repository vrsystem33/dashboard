import { Routes } from '@angular/router';

import { CustomersPage } from './customers';
import { CustomerCategoriesPage } from './categories/categories';

export default [
    { path: '', component: CustomersPage },
    { path: 'categories', component: CustomerCategoriesPage }
] as Routes;
