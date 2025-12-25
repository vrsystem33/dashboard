// store/preferences/preferences.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as Pref from './preferences.actions';
import { PreferencesState } from './preferences.models';

const initial: PreferencesState = { theme: 'dark', language: 'pt', notificationsEnabled: true };

export const preferencesReducer = createReducer(
  initial,
  on(Pref.setTheme, (s, { theme }) => ({ ...s, theme })),
  on(Pref.setLanguage, (s, { language }) => ({ ...s, language })),
  on(Pref.setNotifications, (s, { enabled }) => ({ ...s, notificationsEnabled: enabled }))
);
