import { createAction, props } from '@ngrx/store';

export const initStream = createAction('[Analytics] Init Stream');
export const streamUpdate = createAction('[Analytics] Stream Update', props<{ patch: Partial<Record<keyof import('./analytics.models').AnalyticsState, any>> }>());
export const streamError = createAction('[Analytics] Stream Error', props<{ error: string }>());
