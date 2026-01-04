import { Customer } from '@app/models/customers/customer.model';
import { CustomerResponseDto } from '@app/dto/customers/customer-response.dto';
import { CustomerCreateRequestDto, CustomerUpdateRequestDto } from '@app/dto/customers/customer-request.dto';

export const toCustomer = (dto: CustomerResponseDto): Customer => ({
  uuid: dto.uuid,
  empresaId: dto.empresa_id,
  name: dto.nome,
  email: dto.email,
  phone: dto.telefone,
  birthDate: dto.dt_nascimento ? new Date(dto.dt_nascimento) : undefined,
  language: dto.idioma,
  country: dto.pais,
  active: dto.status,
  createdAt: new Date(dto.criado_em),
  updatedAt: dto.atualizado_em ? new Date(dto.atualizado_em) : undefined,
});

// Em caso de enviar ao backend
export const toCreateCustomerDto = (m: Customer): CustomerCreateRequestDto => ({
  empresa_id: m.empresaId,
  nome: m.name,
  email: m.email,
  telefone: m.phone,
  dt_nascimento: m.birthDate?.toISOString().split('T')[0],
  idioma: m.language,
  pais: m.country,
  status: m.active,
});

export const toUpdateCustomerDto = (m: Partial<Customer>): CustomerUpdateRequestDto => ({
  nome: m.name,
  email: m.email,
  telefone: m.phone,
  dt_nascimento: m.birthDate?.toISOString().split('T')[0],
  idioma: m.language,
  pais: m.country,
  status: m.active,
});
