import { Routes } from '@angular/router';

import { EmployeesPage } from './employees';
import { EmployeeRolesPage } from './roles/roles';
import { EmployeeSchedulesPage } from './schedules/schedules';

export default [
    { path: '', component: EmployeesPage },
    { path: 'roles', component: EmployeeRolesPage },
    { path: 'schedules', component: EmployeeSchedulesPage }
] as Routes;
