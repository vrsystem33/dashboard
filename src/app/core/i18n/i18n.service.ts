import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

type SupportedLanguage = 'pt-BR' | 'en-US';

@Injectable({ providedIn: 'root' })
export class I18nService {
    private readonly storageKey = '__lang__';
    private readonly defaultLanguage: SupportedLanguage = 'pt-BR';
    private readonly supportedLanguages: readonly SupportedLanguage[] = ['pt-BR', 'en-US'] as const;

    private readonly currentLanguageSignal = signal<SupportedLanguage>(this.defaultLanguage);

    readonly languageChanges$: Observable<string>;

    constructor(private readonly translate: TranslateService) {
        this.translate.addLangs([...this.supportedLanguages]);
        this.translate.setDefaultLang(this.defaultLanguage);

        const initialLanguage = this.loadInitialLanguage();

        this.translate.use(initialLanguage);
        this.currentLanguageSignal.set(initialLanguage);

        this.languageChanges$ = this.translate.onLangChange.pipe(
            map((event) => event.lang),
            startWith(initialLanguage)
        );
    }

    getCurrentLanguage(): SupportedLanguage {
        return this.currentLanguageSignal();
    }

    setLanguage(language: string): void {
        const nextLanguage = this.normalizeLanguage(language);

        if (nextLanguage === this.getCurrentLanguage()) return;

        this.translate.use(nextLanguage);
        localStorage.setItem(this.storageKey, nextLanguage);
        this.currentLanguageSignal.set(nextLanguage);
    }

    toggleLanguage(): void {
        const nextLanguage: SupportedLanguage = this.getCurrentLanguage() === 'pt-BR' ? 'en-US' : 'pt-BR';
        this.setLanguage(nextLanguage);
    }

    private loadInitialLanguage(): SupportedLanguage {
        const persisted = localStorage.getItem(this.storageKey);
        const initial = this.normalizeLanguage(persisted ?? this.defaultLanguage);

        localStorage.setItem(this.storageKey, initial);

        return initial;
    }

    private normalizeLanguage(language: string): SupportedLanguage {
        return (this.supportedLanguages as readonly string[]).includes(language) ? (language as SupportedLanguage) : this.defaultLanguage;
    }
}
