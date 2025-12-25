export interface Assistant {
  id: string;
  name: string;
  description: string;
  speechStyle: SpeechStyle;
  serviceType: ServiceType;
  isActive: boolean;
  totalInteractions: number;
  createdAt: string; // ISO date
}

export interface AssistantForm {
  name: string;
  description: string;
  speechStyle: SpeechStyle;
  serviceType: ServiceType;
}

export type SpeechStyle =
  | 'Formal e Profissional'
  | 'Amigável e Casual'
  | 'Enérgico e Entusiasta'
  | 'Calmo e Relaxado'
  | 'Técnico e Detalhado';

export type ServiceType =
  | 'Cardápio'
  | 'Atendimento'
  | 'Suporte Técnico'
  | 'Vendas'
  | 'Informações Gerais';

export const SPEECH_STYLES: SpeechStyle[] = [
  'Formal e Profissional',
  'Amigável e Casual',
  'Enérgico e Entusiasta',
  'Calmo e Relaxado',
  'Técnico e Detalhado'
];

export const SERVICE_TYPES: ServiceType[] = [
  'Cardápio',
  'Atendimento',
  'Suporte Técnico',
  'Vendas',
  'Informações Gerais'
];
