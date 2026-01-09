import { Routes } from '@angular/router';

import { EmployeesPage } from './employees';
import { EmployeeCategoriesPage } from './categories/categories';

export default [
    { path: '', component: EmployeesPage },
    { path: 'categories', component: EmployeeCategoriesPage }
] as Routes;
