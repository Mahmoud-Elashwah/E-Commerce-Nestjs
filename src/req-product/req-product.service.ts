import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReqProduct } from './req-product.schema';

@Injectable()
export class ReqProductService {
  constructor(
    @InjectModel('ReqProduct')
    private readonly reqProductModel: Model<ReqProduct>,
  ) {}
  async create(createReqProductDto: CreateReqProductDto, userId: string) {
    const reqProduct = await this.reqProductModel.findOne({
      titleNeed: createReqProductDto.titleNeed,
      user: userId,
    });
    if (reqProduct) {
      throw new HttpException('Request Product already exists', 400);
    }
    const createdReqProduct = await this.reqProductModel.create({
      ...createReqProductDto,
      user: userId,
    });
    // .populate('User', '-password -__V -role');
    return {
      status: 'success',
      message: 'Request Product created successfully',
      data: createdReqProduct,
    };
  }

  async findAll() {
    const reqProducts = await this.reqProductModel
      .find()
      .populate('user', '-password -__v -role');
    return {
      status: 'success',
      resultes: reqProducts.length,
      data: reqProducts,
    };
  }

  async findOne(id: string, user: any) {
    let reqProduct;
    if (user.role === 'user') {
      reqProduct = await this.reqProductModel
        .findOne({ _id: id, user: user._id })
        .populate('user', '-password -__v -role');
    } else {
      reqProduct = await this.reqProductModel
        .findById(id)
        .populate('user', '-password -__v -role');
    }
    if (!reqProduct) {
      throw new HttpException('Request Product not found', 404);
    }
    return {
      status: 'success',
      data: reqProduct,
    };
  }

  async update(
    id: string,
    updateReqProductDto: UpdateReqProductDto,
    user: any,
  ) {
    const updatedReqProduct = await this.reqProductModel.findOneAndUpdate(
      { _id: id, user: user._id },
      updateReqProductDto,
      { new: true, runValidators: true },
    );
    if (!updatedReqProduct) {
      throw new NotFoundException('Request Product not found');
    }
    return {
      status: 'success',
      message: 'Request Product updated successfully',
      data: updatedReqProduct,
    };
  }

  async remove(id: string, user: any) {
    const deletedReqProduct = await this.reqProductModel.findOneAndDelete({
      _id: id,
      user: user._id,
    });
    if (!deletedReqProduct) {
      throw new NotFoundException('Request Product not found');
    }
    return {
      status: 'success',
      message: 'Request Product deleted successfully',
    };
  }
}
