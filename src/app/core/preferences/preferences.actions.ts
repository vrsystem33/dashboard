// store/preferences/preferences.actions.ts
import { createAction, props } from '@ngrx/store';
import { Theme, Language } from './preferences.models';

export const setTheme = createAction('[Preferences] Set Theme', props<{ theme: Theme }>());
export const setLanguage = createAction('[Preferences] Set Language', props<{ language: Language }>());
export const setNotifications = createAction('[Preferences] Set Notifications', props<{ enabled: boolean }>());
