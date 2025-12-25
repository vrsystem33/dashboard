import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { JwtInterceptor } from '@app/interceptors/jwt.interceptor';
import { HttpProgressInterceptor } from '@app/interceptors/http-progress.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { authReducer } from '@app/core/auth/auth.reducer';
import { preferencesReducer } from '@app/core/preferences/preferences.reducer';
import { aiReducer } from '@app/core/ai/ai.reducer';
import { analyticsReducer } from '@app/core/analytics/analytics.reducer';
import { subscriptionReducer } from '@app/core/subscription/subscription.reducer';
import { metaReducers } from '@app/core/app.meta-reducers';
import { AuthEffects } from '@app/core/auth/auth.effects';
import { AIEffects } from '@app/core/ai/ai.effects';
import { AnalyticsEffects } from '@app/core/analytics/analytics.effects';
import { SubscriptionEffects } from '@app/core/subscription/subscription.effects';
import { MessageService } from 'primeng/api';
import { loadLocale } from '@app/utils/loadLocale';

const userLocale = navigator.language || 'en-US'; // detecta do browser
loadLocale(userLocale);

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),

        // interceptors
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpProgressInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // NgRx store
        provideStore(
            {
                auth: authReducer,
                preferences: preferencesReducer,
                ai: aiReducer,
                analytics: analyticsReducer,
                subscription: subscriptionReducer
            },
            { metaReducers }
        ),
        provideEffects([AuthEffects, AIEffects, AnalyticsEffects, SubscriptionEffects]),
        provideRouterStore(),
        MessageService,
        { provide: LOCALE_ID, useValue: userLocale },
    ]
};
