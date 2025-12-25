// core/services/empresa.service.ts
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, map } from 'rxjs';
import { Empresa } from '@app/models/empresas/empresa.model';
import { EmpresaResponseDto } from '@app/dto/empresas/empresa-response.dto';
import { toEmpresa, toCreateEmpresaDto, toUpdateEmpresaDto } from '@app/mappers/empresas/empresa.mapper';

@Injectable({ providedIn: 'root' })
export class EmpresaService extends BaseService {
  private readonly resource: string = '/empresas';

  list(): Observable<Empresa[]> {
    return this.get<EmpresaResponseDto[]>(this.resource).pipe(
      map(list => list.map(toEmpresa))
    );
  }

  getById(uuid: string): Observable<Empresa> {
    return this.get<EmpresaResponseDto>(`${this.resource}/${uuid}`).pipe(
      map(toEmpresa)
    );
  }

  create(empresa: Empresa): Observable<Empresa> {
    return this.post<EmpresaResponseDto>(this.resource, toCreateEmpresaDto(empresa)).pipe(
      map(toEmpresa)
    );
  }

  update(uuid: string, empresa: Partial<Empresa>): Observable<Empresa> {
    return this.put<EmpresaResponseDto>(`${this.resource}/${uuid}`, toUpdateEmpresaDto(empresa)).pipe(
      map(toEmpresa)
    );
  }

  remove(uuid: string): Observable<void> {
    return super.delete<void>(`${this.resource}/${uuid}`);
  }

  listByCliente(clienteId: string): Observable<Empresa[]> {
    return this.get<EmpresaResponseDto[]>(`${this.resource}/cliente/${clienteId}`).pipe(
      map(list => list.map(toEmpresa))
    );
  }
}
