// store/analytics/analytics.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalyticsState } from './analytics.models';

export const selectAnalytics = createFeatureSelector<AnalyticsState>('analytics');
export const selectConversionRate = createSelector(selectAnalytics, s =>
  s.totalMessages ? s.conversions / s.totalMessages : 0
);
export const selectDailyVolume = createSelector(selectAnalytics, s => s.dailyVolume);
