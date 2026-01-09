export interface SupplierRow {
  uuid: string;
  status: boolean;
  name: string;
  email: string;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  categoryName?: string | null;
  totalSales?: number | null;
  totalSpent?: number | null;
  category_id?: number | null;
  last_name?: string | null;
  nickname?: string | null;
  identification?: string | null;
  secondary_phone?: string | null;
  postal_code?: string | null;
  address?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  complement?: string | null;
}

export interface SupplierCreateRequestDto {
  name: string;
  email: string;
  category_id: number;
  status?: boolean;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  last_name?: string | null;
  nickname?: string | null;
  identification?: string | null;
  secondary_phone?: string | null;
  postal_code?: string | null;
  address?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  complement?: string | null;
}

export type SupplierUpdateRequestDto = Partial<SupplierCreateRequestDto>;
