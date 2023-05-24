import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository/category.repository';
import { Category, CategorySchema } from './schema/category.shema';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
