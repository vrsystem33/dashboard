import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { GuestGuard } from '@app/guards/guest.guard';
import { ForgotPassword } from './forgot-password';
import { ResetPassword } from './reset-password';
import { ForgotPasswordConfirmation } from './forgot-password-confirmation';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'login' },

    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login, canActivate: [GuestGuard] },
    { path: 'forgot-password', component: ForgotPassword, canActivate: [GuestGuard] },
    { path: 'forgot-password/confirmation', component: ForgotPasswordConfirmation },
    { path: 'reset-password', component: ResetPassword, canActivate: [GuestGuard] }

] as Routes;
