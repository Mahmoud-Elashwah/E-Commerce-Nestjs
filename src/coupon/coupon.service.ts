import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupon.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}
  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.couponModel.create({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
    });
    return {
      status: 'success',
      data: coupon,
    };
  }

  async applyCoupon(couponCode: string, userId: string) {
    const applyedCoupon = await this.couponModel.findOne({
      code: couponCode.toUpperCase(),
    });

    if (!applyedCoupon) {
      throw new NotFoundException('Invalid coupon');
    }

    if (applyedCoupon.expireDate.getTime() < Date.now()) {
      throw new NotFoundException('Expire coupon');
    }
    if (
      applyedCoupon.maxUsage &&
      applyedCoupon.usedCount >= applyedCoupon.maxUsage
    ) {
      throw new BadRequestException('Coupon usage exceeded');
    }

    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const discountValue = (cart.totalPrice * applyedCoupon.discount) / 100;

    cart.totalPriceAfterDiscount = Math.max(0, cart.totalPrice - discountValue);

    cart.coupon = {
      couponId: applyedCoupon._id,
      name: applyedCoupon.code,
      discount: applyedCoupon.discount,
    };

    applyedCoupon.usedCount += 1;
    await cart.save();
    await applyedCoupon.save();

    return {
      status: 'success',
      message: 'Coupon applyed successfully',
      data: cart,
    };
  }

  async findAll() {
    const coupons = await this.couponModel.find().lean();

    return {
      status: 'success',
      result: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id).lean();
    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }

    return {
      status: 'success',
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      { new: true, runValidators: true },
    );
    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }

    return {
      status: 'success',
      message: 'coupon updated successfully',
      data: coupon,
    };
  }

  async remove(id: string) {
    const coupon = await this.couponModel.findByIdAndDelete(id);
    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }

    return {
      status: 'success',
      message: 'coupon deleted successfully',
    };
  }
}
