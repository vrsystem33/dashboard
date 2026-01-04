export interface CustomerCreateRequestDto {
  company_id: string;
  name: string;
  email?: string;
  identification?: string;
  phone?: string;
  date_birth?: string; // string ISO ou yyyy-MM-dd
  status?: boolean;
}

export interface CustomerUpdateRequestDto {
  // ─────────────────────────────
  // Personal / Identification
  // ─────────────────────────────
  name?: string;
  last_name?: string;
  nickname?: string;
  identification?: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  birth_date?: string; // ISO: YYYY-MM-DD

  // ─────────────────────────────
  // Address
  // ─────────────────────────────
  postal_code?: string;
  address?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  city?: string;
  state?: string;

  // ─────────────────────────────
  // Status
  // ─────────────────────────────
  status?: boolean;
}
