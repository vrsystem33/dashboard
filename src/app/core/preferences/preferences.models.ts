// store/preferences/preferences.models.ts
export type Theme = 'light' | 'dark';
export type Language = 'pt' | 'en' | 'es';

export interface PreferencesState {
  theme: Theme;
  language: Language;
  notificationsEnabled: boolean;
}
