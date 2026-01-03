import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class I18nService {
    private readonly storageKey = '__lang__';
    private readonly defaultLanguage = 'pt-BR';
    private readonly supportedLanguages = ['pt-BR', 'en-US'] as const;

    private readonly currentLanguageSignal = signal<string>(this.initializeLanguage());

    readonly languageChanges$ = this.translate.onLangChange.pipe(
        map((event) => event.lang),
        startWith(this.currentLanguageSignal())
    );

    constructor(private translate: TranslateService) {
        this.translate.addLangs([...this.supportedLanguages]);
        this.translate.setDefaultLang(this.defaultLanguage);
    }

    getCurrentLanguage(): string {
        return this.currentLanguageSignal();
    }

    setLanguage(language: string): void {
        const nextLanguage = this.normalizeLanguage(language);

        this.translate.use(nextLanguage);
        localStorage.setItem(this.storageKey, nextLanguage);
        this.currentLanguageSignal.set(nextLanguage);
    }

    toggleLanguage(): void {
        const nextLanguage = this.getCurrentLanguage() === 'pt-BR' ? 'en-US' : 'pt-BR';
        this.setLanguage(nextLanguage);
    }

    private initializeLanguage(): string {
        const persistedLanguage = localStorage.getItem(this.storageKey);
        const initialLanguage = this.normalizeLanguage(persistedLanguage || this.defaultLanguage);

        this.translate.use(initialLanguage);
        localStorage.setItem(this.storageKey, initialLanguage);

        return initialLanguage;
    }

    private normalizeLanguage(language: string): string {
        return this.supportedLanguages.includes(language as (typeof this.supportedLanguages)[number])
            ? language
            : this.defaultLanguage;
    }
}
