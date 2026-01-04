import { CustomerRow } from './customers.models';

export interface CustomerListItemDto {
  uuid: string;
  name: string;
  email: string;
  phone?: string | null;
  status?: boolean | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  category_name?: string | null;
  category_id?: number | null;
  total_sales?: number | null;
  total_spent?: number | null;
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

export function toCustomerRow(dto: CustomerListItemDto): CustomerRow {
  return {
    uuid: dto.uuid ?? '',
    name: dto.name ?? '',
    email: dto.email ?? '',
    phone: dto.phone ?? null,
    status: Boolean(dto.status),
    street: dto.street ?? null,
    city: dto.city ?? null,
    state: dto.state ?? null,
    categoryName: dto.category_name ?? null,
    category_id: dto.category_id ?? null,
    totalSales: dto.total_sales != null ? Number(dto.total_sales) : null,
    totalSpent: dto.total_spent != null ? Number(dto.total_spent) : null,
    last_name: dto.last_name ?? null,
    nickname: dto.nickname ?? null,
    identification: dto.identification ?? null,
    secondary_phone: dto.secondary_phone ?? null,
    postal_code: dto.postal_code ?? null,
    address: dto.address ?? null,
    number: dto.number ?? null,
    neighborhood: dto.neighborhood ?? null,
    complement: dto.complement ?? null,
  };
}
