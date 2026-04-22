import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, couponSchema } from './coupon.schema';
import { Cart, cartSchema } from 'src/cart/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: couponSchema },
      { name: Cart.name, schema: cartSchema },
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
