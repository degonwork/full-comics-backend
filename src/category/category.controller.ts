import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // all category
  @Get('/all')
  async allCategory() {
    return this.categoryService.findAllCatrgories();
  }

  @UseGuards(PublisherAuthGuard)
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
