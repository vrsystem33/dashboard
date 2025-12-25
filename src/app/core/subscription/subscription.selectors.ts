// store/subscription/subscription.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubscriptionState } from './subscription.models';

export const selectSubscription = createFeatureSelector<SubscriptionState>('subscription');
export const selectCurrentPlan = createSelector(selectSubscription, s => s.plan);
export const selectRemainingCredits = createSelector(selectSubscription, s => s.remainingCredits);
export const selectMaxAssistants = createSelector(selectSubscription, s => s.maxAssistants);
