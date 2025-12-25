export interface Usuario {
  uuid: string;
  empresaId?: string;

  username: string;
  name: string;
  email: string;
  role: 'admin' | 'super' | 'user';
  active: boolean;
  master: boolean;

  createdAt: Date;
  updatedAt: Date;
}
