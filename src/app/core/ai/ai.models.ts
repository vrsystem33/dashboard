// store/ai/ai.models.ts
export interface KnowledgeBase {
  rules: string[];            // regras de atendimento
  allowedTopics: string[];    // tópicos/menus válidos
  menuVersion?: string;       // versão do cardápio/produto/serviço
}

export type AIStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AIState {
  context: KnowledgeBase | null;
  status: AIStatus;
  error?: string;
}
