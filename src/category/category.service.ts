import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.create(createCategoryDto);
    return {
      status: 'success',
      message: 'category successfully created',
      data: category,
    };
  }

  async findAll() {
    const categories = await this.categoryModel
      .find()
      .populate('subCategories', 'name -category')
      .lean({ virtuals: true });
    return {
      status: 'success',
      result: categories.length,
      data: categories,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryModel
      .findById(id)
      .populate('subCategories', 'name -category')
      .lean({ virtuals: true });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return {
      status: 'success',
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true, runValidators: true },
    );
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return {
      status: 'success',
      message: 'Category updated successfully',
      data: category,
    };
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return {
      status: 'success',
      message: 'Category deleted successfully',
    };
  }
}
