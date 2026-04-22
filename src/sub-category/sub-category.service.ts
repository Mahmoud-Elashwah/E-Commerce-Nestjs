import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.schema';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const category = createSubCategoryDto.category;
    const theCategory = await this.categoryModel.findById(category);
    if (!theCategory) {
      throw new NotFoundException('Category not found');
    }
    const subCategory =
      await this.subCategoryModel.create(createSubCategoryDto);

    return {
      status: 'success',
      data: subCategory,
    };
  }

  async findAll() {
    const subCategories = await this.subCategoryModel
      .find()
      .populate('category', 'name')
      .lean();

    return {
      status: 'success',
      result: subCategories.length,
      data: subCategories,
    };
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryModel
      .findById(id)
      .populate('category', 'name')
      .lean();
    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    return {
      status: 'success',
      data: subCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    if (updateSubCategoryDto.category) {
      const theCategory = await this.categoryModel.findById(
        updateSubCategoryDto.category,
      );
      if (!theCategory) {
        throw new NotFoundException('Category not found');
      }
    }
    const subCategory = await this.subCategoryModel
      .findByIdAndUpdate(id, updateSubCategoryDto, {
        new: true,
        runValidators: true,
      })
      .populate('category', 'name');
    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    return {
      status: 'success',
      message: 'subCategory updated successfully',
      data: subCategory,
    };
  }

  async remove(id: string) {
    const subCategory = await this.subCategoryModel.findByIdAndDelete(id);
    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    return {
      status: 'success',
      message: 'subCategory deleted successfully',
    };
  }
}
