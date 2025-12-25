// core/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, map } from 'rxjs';
import { Usuario } from '@app/models/usuarios/usuario.model';
import { UsuarioResponseDto } from '@app/dto/usuarios/usuario-response.dto';
import { toUsuario, toCreateUsuarioDto, toUpdateUsuarioDto } from '@app/mappers/usuarios/usuario.mapper';

@Injectable({ providedIn: 'root' })
export class UsuarioService extends BaseService {
  private readonly resource: string = '/usuarios';

  list(): Observable<Usuario[]> {
    return this.get<UsuarioResponseDto[]>(this.resource).pipe(
      map(list => list.map(toUsuario))
    );
  }

  listByEmpresa(empresaId: string): Observable<Usuario[]> {
    return this.get<UsuarioResponseDto[]>(`${this.resource}/empresa/${empresaId}`).pipe(
      map(list => list.map(toUsuario))
    );
  }

  getById(uuid: string): Observable<Usuario> {
    return this.get<UsuarioResponseDto>(`${this.resource}/${uuid}`).pipe(
      map(toUsuario)
    );
  }

  create(usuario: Usuario & { password: string }): Observable<Usuario> {
    return this.post<UsuarioResponseDto>(this.resource, toCreateUsuarioDto(usuario)).pipe(
      map(toUsuario)
    );
  }

  update(uuid: string, usuario: Partial<Usuario> & { password?: string }): Observable<Usuario> {
    return this.put<UsuarioResponseDto>(`${this.resource}/${uuid}`, toUpdateUsuarioDto(usuario)).pipe(
      map(toUsuario)
    );
  }

  remove(uuid: string): Observable<void> {
    return super.delete<void>(`${this.resource}/${uuid}`);
  }
}
