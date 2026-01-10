import { Routes } from '@angular/router';

import { EmployeesPage } from './employees';
import { EmployeeCategoriesPage } from './categories/categories';
import { EmployeeSchedulesPage } from './schedules/schedules';

export default [
    { path: '', component: EmployeesPage },
    { path: 'roles', component: EmployeeCategoriesPage },
    { path: 'schedules', component: EmployeeSchedulesPage }
] as Routes;
