// core/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, map } from 'rxjs';
import { Cliente } from '@app/models/clientes/cliente.model';
import { ClienteResponseDto } from '@app/dto/clientes/cliente-response.dto';
import { toCliente, toCreateClienteDto, toUpdateClienteDto } from '@app/mappers/clientes/cliente.mapper';

@Injectable({ providedIn: 'root' })
export class ClienteService extends BaseService {
  private readonly resource: string = '/clientes';

  list(): Observable<Cliente[]> {
    return this.get<ClienteResponseDto[]>(this.resource).pipe(
      map(list => list.map(toCliente))
    );
  }

  getById(uuid: string): Observable<Cliente> {
    return this.get<ClienteResponseDto>(`${this.resource}/${uuid}`).pipe(
      map(toCliente)
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.post<ClienteResponseDto>(this.resource, toCreateClienteDto(cliente)).pipe(
      map(toCliente)
    );
  }

  update(uuid: string, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.put<ClienteResponseDto>(`${this.resource}/${uuid}`, toUpdateClienteDto(cliente)).pipe(
      map(toCliente)
    );
  }

  remove(uuid: string): Observable<void> {
    return this.delete<void>(`${this.resource}/${uuid}`);
  }
}
