import { Routes } from '@angular/router';

import { UsersPage } from './users';
import { UserCategoriesPage } from './categories/categories';

export default [
    { path: '', component: UsersPage },
    { path: 'categories', component: UserCategoriesPage }
] as Routes;
