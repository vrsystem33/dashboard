// core/mappers/empresas/empresa.mapper.ts
import { EmpresaResponseDto } from '@app/dto/empresas/empresa-response.dto';
import { EmpresaCreateRequestDto, EmpresaUpdateRequestDto } from '@app/dto/empresas/empresa-request.dto';
import { Empresa } from '@app/models/empresas/empresa.model';

export const toEmpresa = (dto: EmpresaResponseDto): Empresa => ({
  uuid: dto.uuid,
  name: dto.nome,
  slug: dto.slug,
  businessNumber: dto.numero_business,
  contactPhone: dto.telefone_contato,
  email: dto.email,
  website: dto.website,
  type: dto.tipo,
  language: dto.idioma,
  country: dto.pais,
  document: dto.documento,
  size: dto.porte,
  active: dto.ativo,
  createdAt: new Date(dto.criado_em),
  updatedAt: new Date(dto.atualizado_em)
});

export const toCreateEmpresaDto = (m: Empresa): EmpresaCreateRequestDto => ({
  nome: m.name,
  slug: m.slug,
  numero_business: m.businessNumber,
  telefone_contato: m.contactPhone,
  email: m.email,
  website: m.website,
  tipo: m.type,
  idioma: m.language,
  pais: m.country,
  documento: m.document,
  porte: m.size,
  ativo: m.active
});

export const toUpdateEmpresaDto = (m: Partial<Empresa>): EmpresaUpdateRequestDto => ({
  nome: m.name,
  slug: m.slug,
  numero_business: m.businessNumber,
  telefone_contato: m.contactPhone,
  email: m.email,
  website: m.website,
  tipo: m.type,
  idioma: m.language,
  pais: m.country,
  documento: m.document,
  porte: m.size,
  ativo: m.active
});
