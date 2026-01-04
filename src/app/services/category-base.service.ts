import { Observable, map } from 'rxjs';
import { BaseService } from './base.service';
import { Category } from '@app/models/categories/category.model';
import { CategoryResponseDto } from '@app/dto/categories/category-response.dto';
import { toCategory, toCreateCategoryDto } from '@app/mappers/categories/category.mapper';

export abstract class CategoryBaseService extends BaseService {
  protected abstract readonly resource: string;

  list(): Observable<Category[]> {
    return this.get<CategoryResponseDto[]>(this.resource).pipe(
      map(list => list.map(toCategory))
    );
  }

  getById(uuid: string): Observable<Category> {
    return this.get<CategoryResponseDto>(`${this.resource}/${uuid}`).pipe(
      map(toCategory)
    );
  }

  create(category: Partial<Category>): Observable<Category> {
    return this.post<CategoryResponseDto>(
      this.resource,
      toCreateCategoryDto(category)
    ).pipe(map(toCategory));
  }

  update(uuid: string, category: Partial<Category>): Observable<Category> {
    return this.put<CategoryResponseDto>(
      `${this.resource}/${uuid}`,
      toCreateCategoryDto(category)
    ).pipe(map(toCategory));
  }

  remove(uuid: string): Observable<void> {
    return this.delete<void>(`${this.resource}/${uuid}`);
  }
}
