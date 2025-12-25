import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PreferencesActions from '@app/core/preferences/preferences.actions';
import * as PreferencesSelectors from '@app/core/preferences/preferences.selectors';
import { Theme, Language } from '@app/core/preferences/preferences.models';

@Injectable({ providedIn: 'root' })
export class PreferencesFacade {
  private readonly store = inject(Store);

  // Observables reativos da store
  readonly theme$ = this.store.select(PreferencesSelectors.selectTheme);
  readonly language$ = this.store.select(PreferencesSelectors.selectLanguage);
  readonly notificationsEnabled$ = this.store.select(PreferencesSelectors.selectNotificationsEnabled);

  // Métodos para despachar ações
  setTheme(theme: Theme) {
    this.store.dispatch(PreferencesActions.setTheme({ theme }));
  }

  setLanguage(language: Language) {
    this.store.dispatch(PreferencesActions.setLanguage({ language }));
  }

  setNotifications(enabled: boolean) {
    this.store.dispatch(PreferencesActions.setNotifications({ enabled }));
  }
}
