import { AuthState } from './auth/auth.models';
import { PreferencesState } from './preferences/preferences.models';
import { AIState } from './ai/ai.models';
import { AnalyticsState } from './analytics/analytics.models';
import { SubscriptionState } from './subscription/subscription.models';

export interface AppState {
  auth: AuthState;
  preferences: PreferencesState;
  ai: AIState;
  analytics: AnalyticsState;
  subscription: SubscriptionState;
}
