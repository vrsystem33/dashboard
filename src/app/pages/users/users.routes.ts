import { Routes } from '@angular/router';

import { UsersPage } from './users';
import { UserCategoriesPage } from './permissions/permissions';

export default [
    { path: '', component: UsersPage },
    { path: 'permissions', component: UserCategoriesPage }
] as Routes;
