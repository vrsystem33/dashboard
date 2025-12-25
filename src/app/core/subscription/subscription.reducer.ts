// store/subscription/subscription.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as S from './subscription.actions';
import { SubscriptionState } from './subscription.models';

const initial: SubscriptionState = { plan: null, remainingCredits: 0, maxAssistants: 0, status: 'idle' as const };

export const subscriptionReducer = createReducer(
  initial,
  on(S.loadSubscription,  (s) => ({ ...s, status: 'loading' as const })),
  on(S.loadSubscriptionSuccess, (s, { plan, remainingCredits, maxAssistants }) =>
    ({ ...s, plan, remainingCredits, maxAssistants, status: 'active' as const })),
  on(S.paymentSuccess, (s, { plan }) => ({ ...s, plan, status: 'active' as const }))
);
