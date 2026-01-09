export interface CarrierRow {
  uuid: string;
  status: boolean;
  tradeName: string;
  email: string;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  categoryName?: string | null;
  category_id?: number | null;
  nameResponsible?: string | null;
  nickname?: string | null;
  identification?: string | null;
  secondary_phone?: string | null;
  postal_code?: string | null;
  address?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  complement?: string | null;
}

export interface CarrierCreateRequestDto {
  trade_name: string;
  email: string;
  category_id: number;
  status?: boolean;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  name_responsible?: string | null;
  nickname?: string | null;
  identification?: string | null;
  secondary_phone?: string | null;
  postal_code?: string | null;
  address?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  complement?: string | null;
}

export type CarrierUpdateRequestDto = Partial<CarrierCreateRequestDto>;
