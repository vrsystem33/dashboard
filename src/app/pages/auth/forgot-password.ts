import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@app/services/auth.service';
import { finalize } from 'rxjs';
import { AppFloatingConfigurator } from '@app/layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    MessageModule,
    AppFloatingConfigurator
  ],
  template: `
    <app-floating-configurator />
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950">
      <div class="bg-surface-0 dark:bg-surface-900 p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl font-semibold mb-4">Forgot Password</h2>
        <p class="text-muted-color mb-6">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <div class="mb-4">
          <input pInputText [(ngModel)]="email" placeholder="Email" class="w-full" type="email" />
        </div>

        <p-button
          label="Send Reset Link"
          styleClass="w-full"
          [disabled]="loading || !email"
          (onClick)="submit()"
        ></p-button>

        <p-message *ngIf="message" severity="success" [text]="message"></p-message>
        <p-message *ngIf="error" severity="error" [text]="error"></p-message>

        <div class="mt-6 text-center">
          <p-button
            label="Back to Login"
            styleClass="p-button-text"
            routerLink="/auth/login"
          ></p-button>
        </div>
      </div>
    </div>
  `
})
export class ForgotPassword {
  email = '';
  message: string | undefined = undefined;
  error: string | undefined = undefined;
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.loading = true;
    this.message = undefined;
    this.error = undefined;

    this.auth.forgotPassword({ email: this.email })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.message = 'We sent you an email with reset instructions.';

          sessionStorage.setItem('fp_email', this.email);
          this.router.navigate(['/auth/forgot-password/confirmation'], {
            state: { email: this.email }
          });
        },
        error: err => this.error = err?.error?.message ?? 'Failed to send reset email.'
      });
  }
}
