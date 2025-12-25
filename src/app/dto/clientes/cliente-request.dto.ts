export interface ClienteCreateRequestDto {
  empresa_id: string;
  nome?: string;
  email?: string;
  telefone?: string;
  dt_nascimento?: string; // string ISO ou yyyy-MM-dd
  idioma?: string;
  pais?: string;
  status?: boolean;
}

export interface ClienteUpdateRequestDto {
  nome?: string;
  email?: string;
  telefone?: string;
  dt_nascimento?: string;
  idioma?: string;
  pais?: string;
  status?: boolean;
}
