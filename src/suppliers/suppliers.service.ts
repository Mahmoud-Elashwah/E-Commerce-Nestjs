import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Suppliers } from './suppliers.schema';
import { Model } from 'mongoose';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Suppliers.name) private suppliersModel: Model<Suppliers>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.suppliersModel.create(createSupplierDto);
    return {
      status: 'success',
      data: supplier,
    };
  }

  async findAll() {
    const suppliers = await this.suppliersModel.find().lean();
    return {
      status: 'success',
      result: suppliers.length,
      data: suppliers,
    };
  }

  async findOne(id: string) {
    const supplier = await this.suppliersModel.findById(id).lean();
    if (!supplier) {
      throw new NotFoundException('supplier not found');
    }
    return {
      status: 'success',
      data: supplier,
    };
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.suppliersModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      { new: true, runValidators: true },
    );
    if (!supplier) {
      throw new NotFoundException('supplier not found');
    }
    return {
      status: 'success',
      message: 'supplier updated successfully',
      data: supplier,
    };
  }

  async remove(id: string) {
    const supplier = await this.suppliersModel.findByIdAndDelete(id);
    if (!supplier) {
      throw new NotFoundException('supplier not found');
    }
    return {
      status: 'success',
      message: 'supplier deleted successfully',
    };
  }
}
