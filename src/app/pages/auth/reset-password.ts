import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@app/services/auth.service';
import { finalize } from 'rxjs';
import { AppFloatingConfigurator } from '@app/layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    PasswordModule,
    RippleModule,
    AppFloatingConfigurator,
    MessageModule
  ],
  template: `
    <app-floating-configurator />
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950">
      <div class="bg-surface-0 dark:bg-surface-900 p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl font-semibold mb-4">Reset Password</h2>
        <p class="text-muted-color mb-6">Enter your new password below.</p>

        <div class="mb-4">
          <p-password [(ngModel)]="password" placeholder="New Password" [toggleMask]="true" [feedback]="false" class="w-full"></p-password>
        </div>

        <div class="mb-4">
          <p-password [(ngModel)]="confirm" placeholder="Confirm Password" [toggleMask]="true" [feedback]="false" class="w-full"></p-password>
        </div>

        <p-button
          label="Reset Password"
          styleClass="w-full"
          [disabled]="loading || !password || password !== confirm"
          (onClick)="submit()"
        ></p-button>

        <p-message *ngIf="message" severity="success" [text]="message"></p-message>
        <!-- <p-message *ngIf="error" severity="error" [text]="error"></p-message> -->
      </div>
    </div>
  `
})
export class ResetPassword {
  password = '';
  confirm = '';
  message: string | undefined = undefined;
  error: string | undefined = undefined;
  loading = false;

  private token: string = '';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') ?? '';
    });
  }

  submit() {
    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.message = undefined;
    this.error = undefined;

    this.auth.resetPassword({ token: this.token, password: this.password })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.message = 'Password updated successfully.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: err => this.error = err
      });
  }
}
