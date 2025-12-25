// store/ai/ai.actions.ts
import { createAction, props } from '@ngrx/store';
import { KnowledgeBase } from './ai.models';

export const loadKnowledgeBase = createAction('[AI] Load Knowledge Base', props<{ companyId: string }>());
export const loadKnowledgeBaseSuccess = createAction('[AI] Load Knowledge Base Success', props<{ kb: KnowledgeBase }>());
export const loadKnowledgeBaseFailure = createAction('[AI] Load Knowledge Base Failure', props<{ error: string }>());
