// store/preferences/preferences.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PreferencesState } from './preferences.models';

export const selectPreferences = createFeatureSelector<PreferencesState>('preferences');
export const selectTheme = createSelector(selectPreferences, s => s.theme);
export const selectLanguage = createSelector(selectPreferences, s => s.language);
export const selectNotificationsEnabled = createSelector(selectPreferences, s => s.notificationsEnabled);
