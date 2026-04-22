import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo, Types } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Product.name,
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    default: [],
  })
  cartItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: Number,
    default: 0,
  })
  totalPrice: number;

  @Prop({
    type: Number,
  })
  totalPriceAfterDiscount: number;

  @Prop({
    type: {
      couponId: { type: mongoose.Schema.Types.ObjectId, ref: Coupon.name },
      name: { type: String },
      discount: { type: Number },
    },
  })
  coupon?: {
    name: string;
    couponId: Types.ObjectId;
    discount: number;
  };

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  userId: string;
}

export const cartSchema = SchemaFactory.createForClass(Cart);
