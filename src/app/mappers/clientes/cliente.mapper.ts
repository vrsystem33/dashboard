import { Cliente } from '@app/models/clientes/cliente.model';
import { ClienteResponseDto } from '@app/dto/clientes/cliente-response.dto';
import { ClienteCreateRequestDto, ClienteUpdateRequestDto } from '@app/dto/clientes/cliente-request.dto';

export const toCliente = (dto: ClienteResponseDto): Cliente => ({
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
export const toCreateClienteDto = (m: Cliente): ClienteCreateRequestDto => ({
  empresa_id: m.empresaId,
  nome: m.name,
  email: m.email,
  telefone: m.phone,
  dt_nascimento: m.birthDate?.toISOString().split('T')[0],
  idioma: m.language,
  pais: m.country,
  status: m.active,
});

export const toUpdateClienteDto = (m: Partial<Cliente>): ClienteUpdateRequestDto => ({
  nome: m.name,
  email: m.email,
  telefone: m.phone,
  dt_nascimento: m.birthDate?.toISOString().split('T')[0],
  idioma: m.language,
  pais: m.country,
  status: m.active,
});
