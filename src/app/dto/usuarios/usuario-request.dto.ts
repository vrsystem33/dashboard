export interface UsuarioCreateRequestDto {
  empresa_id?: string;
  username: string;
  nome: string;
  email: string;
  password: string;
  role: 'admin' | 'super' | 'user'; // ajustar conforme seu RoleEnum
  status?: boolean;
  master?: boolean;
}

export interface UsuarioUpdateRequestDto {
  username?: string;
  nome?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'super' | 'user';
  status?: boolean;
  master?: boolean;
}
