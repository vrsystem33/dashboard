export interface EmpresaCreateRequestDto {
  nome: string;
  slug?: string;
  numero_business: string;

  telefone_contato?: string;
  email?: string;
  website?: string;

  tipo?: string;
  idioma?: string;
  pais?: string;

  documento: string;
  porte: string;
  ativo?: boolean;
}

export interface EmpresaUpdateRequestDto {
  nome?: string;
  slug?: string;
  numero_business?: string;

  telefone_contato?: string;
  email?: string;
  website?: string;

  tipo?: string;
  idioma?: string;
  pais?: string;

  documento?: string;
  porte?: string;
  ativo?: boolean;
}
