export interface UsuarioResponseDto {
  uuid: string;
  empresa_id?: string;

  username: string;
  nome: string;
  email: string;
  role: 'admin' | 'super' | 'user';
  status: boolean;
  master: boolean;

  criado_em: string;
  atualizado_em: string;
}
