export interface Cliente {
  uuid: string;
  empresaId: string;
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  language?: string;
  country?: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
