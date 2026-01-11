export interface EmployeeRow {
  uuid: string;
  status: boolean;
  name: string;
  email: string;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  schedule_id?: string | null;
  role_id?: number | null;
  roleName?: string | null;
  roleDescription?: string | null;
  totalSales?: number | null;
  totalSpent?: number | null;
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

export interface EmployeeCreateRequestDto {
  name: string;
  email: string;
  role_id: number;
  status?: boolean;
  schedule_id?: string | null;
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

export type EmployeeUpdateRequestDto = Partial<EmployeeCreateRequestDto>;
