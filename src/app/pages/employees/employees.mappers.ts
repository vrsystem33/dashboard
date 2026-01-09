import { EmployeeRow } from './employees.models';

export interface EmployeeListItemDto {
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

export interface EmployeeItemDto {
  uuid: string;
  status?: boolean | null;
  category_id?: number | null;
  personal_info: {
    name: string;
    last_name?: string | null;
    nickname?: string | null;
    email: string;
    identification?: string | null;
    phone?: string | null;
    secondary_phone?: string | null;
    birth_date?: string | null;
    status?: boolean | null;
  };
  address: {
    postal_code?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    number?: string | null;
    neighborhood?: string | null;
    complement?: string | null;
  };
}

export function toEmployeeRow(dto: EmployeeListItemDto): EmployeeRow {
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

export function toEmployee(dto: EmployeeItemDto): EmployeeRow {

  return {
    uuid: dto.uuid ?? '',
    name: dto.personal_info.name ?? '',
    email: dto.personal_info.email ?? '',
    phone: dto.personal_info.phone ?? null,
    status: Boolean(dto.status),
    city: dto.address.city ?? null,
    state: dto.address.state ?? null,
    category_id: dto.category_id ?? null,
    last_name: dto.personal_info.last_name ?? null,
    nickname: dto.personal_info.nickname ?? null,
    identification: dto.personal_info.identification ?? null,
    secondary_phone: dto.personal_info.secondary_phone ?? null,
    postal_code: dto.address.postal_code ?? null,
    address: dto.address.address ?? null,
    number: dto.address.number ?? null,
    neighborhood: dto.address.neighborhood ?? null,
    complement: dto.address.complement ?? null,
  };
}