export interface Empresa {
  uuid: string;
  name: string;
  slug: string;
  businessNumber: string;

  contactPhone?: string;
  email?: string;
  website?: string;

  type: string;
  language: string;
  country: string;
  document: string;
  size: string;
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}
