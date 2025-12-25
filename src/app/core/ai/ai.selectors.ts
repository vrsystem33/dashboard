// store/ai/ai.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AIState } from './ai.models';

export const selectAI = createFeatureSelector<AIState>('ai');
export const selectCurrentContext = createSelector(selectAI, s => s.context);
export const selectAllowedTopics = createSelector(selectCurrentContext, c => c?.allowedTopics ?? []);
export const selectAIStatus = createSelector(selectAI, s => s.status);
