import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@app/layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-forgot-password-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule, AppFloatingConfigurator],
  template: `
    <app-floating-configurator />
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950">
      <div class="bg-surface-0 dark:bg-surface-900 p-8 rounded-lg shadow-md w-[28rem] text-center animate-fadein">
        <h2 class="text-2xl font-semibold mb-4">Check your email</h2>
        <p class="text-muted-color mb-6">
          If the email <span class="font-medium text-primary">{{ email }}</span> exists in our system, we sent you a reset link.
        </p>

        <div class="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>

        <p-button label="Back to Login" styleClass="w-full" (onClick)="goLogin()"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .animate-fadein {
      animation: fadeIn 0.6s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ForgotPasswordConfirmation {
  email = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras.state?.['email'] ?? sessionStorage.getItem('fp_email') ?? '';
  }

  goLogin() {
    this.router.navigate(['/auth/login']);
  }
}
