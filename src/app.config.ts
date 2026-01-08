import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

import { NgxSpinnerModule } from "ngx-spinner";

import { appRoutes } from './app.routes';

import { authReducer } from '@app/core/auth/auth.reducer';
import { preferencesReducer } from '@app/core/preferences/preferences.reducer';
import { analyticsReducer } from '@app/core/analytics/analytics.reducer';
import { subscriptionReducer } from '@app/core/subscription/subscription.reducer';
import { metaReducers } from '@app/core/app.meta-reducers';
import { AuthEffects } from '@app/core/auth/auth.effects';
import { AnalyticsEffects } from '@app/core/analytics/analytics.effects';
import { SubscriptionEffects } from '@app/core/subscription/subscription.effects';

import { JwtInterceptor } from '@app/interceptors/jwt.interceptor';
import { HttpProgressInterceptor } from '@app/interceptors/http-progress.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';

import { loadLocale } from '@app/utils/loadLocale';


export function httpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/i18n/', '.json');
}

const storedLanguage = localStorage.getItem('__lang__');
const defaultLanguage = 'pt-BR';
const initialLanguage = storedLanguage || defaultLanguage;

loadLocale(initialLanguage);

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
                analytics: analyticsReducer,
                subscription: subscriptionReducer
            },
            { metaReducers }
        ),
        provideEffects([AuthEffects, AnalyticsEffects, SubscriptionEffects]),
        provideRouterStore(),
        MessageService,
        { provide: LOCALE_ID, useValue: initialLanguage },
        importProvidersFrom(
            TranslateModule.forRoot({
                defaultLanguage,
                loader: {
                    provide: TranslateLoader,
                    useFactory: httpLoaderFactory,
                    deps: [HttpClient]
                }
            }),
            BrowserAnimationsModule,
            NgxSpinnerModule.forRoot({ type: 'ball-atom' })
        ),
    ]
};
