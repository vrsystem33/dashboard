import { Category } from '@app/models/categories/category.model';
import { CategoryResponseDto } from '@app/dto/categories/category-response.dto';
import { CategoryCreateRequestDto, CategoryUpdateRequestDto } from '@app/dto/categories/category-request.dto';

export const toCategory = (dto: CategoryResponseDto): Category => ({
  id: dto.id,
  uuid: dto.uuid,
  name: dto.name,
  description: dto.description,
  active: dto.active
});

// Em caso de enviar ao backend
export const toCreateCategoryDto  = (category: Partial<Category>): CategoryCreateRequestDto => ({
  name: category.name!,
  description: category?.description
});

export const toUpdateCategoryDto = (category: Partial<Category>): CategoryUpdateRequestDto => ({
  name: category.name!,
  description: category.description
});
