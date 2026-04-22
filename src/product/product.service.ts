import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiFeatures } from 'src/utils/api-features.utils';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productModel.findOne({
      title: createProductDto.title,
      color: createProductDto.color,
    });
    if (existingProduct) {
      throw new HttpException('Product with this title already exists', 400);
    }

    const categoryExists = await this.categoryModel.findById(
      createProductDto.category,
    );
    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }
    const createdProduct = await this.productModel.create(createProductDto);

    return {
      status: 'success',
      message: 'Product created successfully',
      data: createdProduct,
    };
  }

  async findAll(query: any) {
    const feature = new ApiFeatures<Product>(this.productModel.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products = await feature.query;
    return {
      status: 'success',
      results: products.length,
      data: products,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      status: 'success',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto.category) {
      const categoryExists = await this.categoryModel.exists({
        _id: updateProductDto.category,
      });
      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }
    }

    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true, runValidators: true },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      status: 'success',
      message: 'Product updated successfully',
      data: product,
    };
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      status: 'success',
      message: 'Product removed successfully',
    };
  }
}
