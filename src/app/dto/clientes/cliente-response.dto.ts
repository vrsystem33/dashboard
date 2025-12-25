export interface ClienteResponseDto {
  uuid: string;
  empresa_id: string;
  nome?: string;
  email?: string;
  telefone?: string;
  dt_nascimento?: string;
  idioma?: string;
  pais?: string;
  status: boolean;
  criado_em: string;       // ISO no backend
  atualizado_em?: string;  // ISO opcional
}
