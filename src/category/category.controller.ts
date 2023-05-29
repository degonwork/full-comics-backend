import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // all category
  @Get('/all')
  async allCategory() {
    console.log('here');
    return this.categoryService.findAllCatrgories();
  }
}
