import { AuthState } from './auth/auth.models';
import { PreferencesState } from './preferences/preferences.models';
import { AnalyticsState } from './analytics/analytics.models';
import { SubscriptionState } from './subscription/subscription.models';

export interface AppState {
  auth: AuthState;
  preferences: PreferencesState;
  analytics: AnalyticsState;
  subscription: SubscriptionState;
}
