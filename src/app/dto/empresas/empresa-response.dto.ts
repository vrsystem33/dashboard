export interface EmpresaResponseDto {
  uuid: string;
  nome: string;
  slug: string;
  numero_business: string;

  telefone_contato?: string;
  email?: string;
  website?: string;

  tipo: string;
  idioma: string;
  pais: string;
  documento: string;
  porte: string;
  ativo: boolean;

  criado_em: string;
  atualizado_em: string;
}
