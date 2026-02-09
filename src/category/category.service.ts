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
    if (!category) {
      throw new HttpException('error', 400);
    }
    return {
      status: 'success',
      message: 'category successfully created',
      data: category,
    };
  }

  async findAll() {
    const ctegorys = await this.categoryModel.find();
    return {
      status: 'success',
      result: ctegorys.length,
      data: ctegorys,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException();
    }
    return `This action returns a #${id} category`;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
