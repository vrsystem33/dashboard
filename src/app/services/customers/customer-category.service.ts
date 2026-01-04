import { Injectable } from '@angular/core';
import { CategoryBaseService } from '../category-base.service';

@Injectable({ providedIn: 'root' })
export class CustomerCategoryService extends CategoryBaseService {
  protected readonly resource = '/customers/categories';
}
