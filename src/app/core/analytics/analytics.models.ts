// store/analytics/analytics.models.ts
export interface AnalyticsState {
  totalMessages: number;
  conversions: number;
  ticketsResolved: number;
  dailyVolume: Record<string, number>; // yyyy-mm-dd -> count
}
