import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseService } from '../base.service';

import { Customer } from '@app/models/customers/customer.model';
import { CustomerResponseDto } from '@app/dto/customers/customer-response.dto';
import { toCreateCustomerDto, toCustomer, toUpdateCustomerDto } from '@app/mappers/customers/customer.mapper';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService {
  private readonly resource: string = '/customers';

  list(): Observable<Customer[]> {
    return this.get<CustomerResponseDto[]>(this.resource).pipe(
      map(list => list.map(toCustomer))
    );
  }

  getById(uuid: string): Observable<Customer> {
    return this.get<CustomerResponseDto>(`${this.resource}/${uuid}`).pipe(
      map(toCustomer)
    );
  }

  create(customer: Customer): Observable<Customer> {
    return this.post<CustomerResponseDto>(this.resource, toCreateCustomerDto(customer)).pipe(
      map(toCustomer)
    );
  }

  update(uuid: string, customer: Partial<Customer>): Observable<Customer> {
    return this.put<CustomerResponseDto>(`${this.resource}/${uuid}`, toUpdateCustomerDto(customer)).pipe(
      map(toCustomer)
    );
  }

  remove(uuid: string): Observable<void> {
    return this.delete<void>(`${this.resource}/${uuid}`);
  }
}
