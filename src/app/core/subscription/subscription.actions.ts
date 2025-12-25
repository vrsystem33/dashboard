// store/subscription/subscription.actions.ts
import { createAction, props } from '@ngrx/store';
import { PlanTier } from './subscription.models';

export const loadSubscription = createAction('[Subscription] Load');
export const loadSubscriptionSuccess = createAction('[Subscription] Load Success', props<{
  plan: PlanTier; remainingCredits: number; maxAssistants: number;
}>());
export const loadSubscriptionFailure = createAction('[Subscription] Load Failure', props<{ error: string }>());

export const activateTrial = createAction('[Subscription] Activate Trial');
export const renewSubscription = createAction('[Subscription] Renew');
export const paymentSuccess = createAction('[Subscription] Payment Success', props<{ plan: PlanTier }>());
export const paymentFailure = createAction('[Subscription] Payment Failure', props<{ error: string }>());
