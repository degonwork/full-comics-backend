import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './repository/category.repository';
import { CategoryDocument } from './schema/category.shema';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    return this.categoryRepository.createObject(createCategoryDto);
  }

  async findCategory(name: string): Promise<CategoryDocument> {
    return this.categoryRepository.findOneObject({ name });
  }

  async findAllCatrgories(): Promise<any> {
    const categories = await this.categoryRepository.findObjectNoLimit();
    if (categories === null || categories.length === 0) {
      return 'No categories created';
    }
    return categories;
  }
}
