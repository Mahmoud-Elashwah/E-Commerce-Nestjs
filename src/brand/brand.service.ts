import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}
  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.brandModel.create(createBrandDto);
    return {
      status: 'success',
      message: 'brand successfully created',
      data: brand,
    };
  }

  async findAll() {
    const brands = await this.brandModel.find().lean();

    return {
      status: 'success',
      result: brands.length,
      data: brands,
    };
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).lean();
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return {
      status: 'success',
      data: brand,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findByIdAndUpdate(id, updateBrandDto, {
      new: true,
      runValidators: true,
    });
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return {
      status: 'success',
      message: 'brand updated successfully',
      data: brand,
    };
  }

  async remove(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id);
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return {
      status: 'success',
      message: 'brand deleted successfully',
    };
  }
}
