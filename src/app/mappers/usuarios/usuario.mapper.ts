// core/mappers/usuarios/usuario.mapper.ts
import { Usuario } from '@app/models/usuarios/usuario.model';
import { UsuarioResponseDto } from '@app/dto/usuarios/usuario-response.dto';
import { UsuarioCreateRequestDto, UsuarioUpdateRequestDto } from '@app/dto/usuarios/usuario-request.dto';

export const toUsuario = (dto: UsuarioResponseDto): Usuario => ({
  uuid: dto.uuid,
  empresaId: dto.empresa_id,
  username: dto.username,
  name: dto.nome,
  email: dto.email,
  role: dto.role,
  active: dto.status,
  master: dto.master,
  createdAt: new Date(dto.criado_em),
  updatedAt: new Date(dto.atualizado_em)
});

export const toCreateUsuarioDto = (m: Usuario & { password: string }): UsuarioCreateRequestDto => ({
  empresa_id: m.empresaId,
  username: m.username,
  nome: m.name,
  email: m.email,
  password: m['password'], // senha só no create/update
  role: m.role,
  status: m.active,
  master: m.master
});

export const toUpdateUsuarioDto = (m: Partial<Usuario> & { password?: string }): UsuarioUpdateRequestDto => ({
  username: m.username,
  nome: m.name,
  email: m.email,
  password: m['password'],
  role: m.role,
  status: m.active,
  master: m.master
});
