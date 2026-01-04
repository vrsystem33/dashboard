export interface CustomerResponseDto {
  uuid: string;
  company_id: string;
  person_name?: string;
  person_email?: string;
  person_phone?: string;
  status: boolean;
  // criado_em: string;       // ISO no backend
  // atualizado_em?: string;  // ISO opcional
}
