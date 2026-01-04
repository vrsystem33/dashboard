export interface Customer {
  uuid: string;
  empresaId: string;
  name?: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  status: boolean;
  birthDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

/*Algo a se pensar no futuro
language?: string;
country?: string;
*/
