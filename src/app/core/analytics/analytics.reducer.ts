// store/analytics/analytics.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as A from './analytics.actions';
import { AnalyticsState } from './analytics.models';

const initial: AnalyticsState = { totalMessages: 0, conversions: 0, ticketsResolved: 0, dailyVolume: {} };

export const analyticsReducer = createReducer(
  initial,
  on(A.streamUpdate, (s, { patch }) => ({ ...s, ...patch }))
);
