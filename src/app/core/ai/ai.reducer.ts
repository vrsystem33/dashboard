// store/ai/ai.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AI from './ai.actions';
import { AIState } from './ai.models';

const initial: AIState = { context: null, status: 'idle' };

export const aiReducer = createReducer(
  initial,
  on(AI.loadKnowledgeBase, (s) => ({ ...s, status: 'loading' as const, error: undefined })),
  on(AI.loadKnowledgeBaseSuccess, (s, { kb }) => ({ ...s, status: 'ready' as const, context: kb })),
  on(AI.loadKnowledgeBaseFailure, (s, { error }) => ({ ...s, status: 'error' as const, error }))
);
