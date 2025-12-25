// store/subscription/subscription.models.ts
export type PlanTier = 'trial' | 'basic' | 'pro';

export type SubscriptionStatus = 'idle' | 'loading' | 'active' | 'expired';
export interface SubscriptionState {
  plan: PlanTier | null;
  remainingCredits: number;
  maxAssistants: number;
  status: SubscriptionStatus;
}
