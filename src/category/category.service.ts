import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './repository/category.repository';
import { CategoryDocument } from './schema/category.shema';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository){}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
        return this.categoryRepository.createObject(createCategoryDto);
    }
}
