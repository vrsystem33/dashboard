import { Routes } from '@angular/router';

import { CarriersPage } from './carriers';
import { CarrierCategoriesPage } from './categories/categories';

export default [
    { path: '', component: CarriersPage },
    { path: 'categories', component: CarrierCategoriesPage }
] as Routes;
