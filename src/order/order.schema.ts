import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop([
    {
      product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
      },

      quantity: {
        type: Number,
        default: 1,
      },

      color: String,

      price: {
        type: Number,
        required: true,
      },

      priceAfterDiscount: Number,
    },
  ])
  cartItems: {
    product: Types.ObjectId;
    quantity: number;
    color: string;
    price: number;
    priceAfterDiscount?: number;
  }[];

  @Prop({ default: 0 })
  taxPrice: number;

  @Prop({ default: 0 })
  shippingPrice: number;

  @Prop({ required: true })
  totalOrderPrice: number;

  @Prop({ type: String, enum: ['cash', 'card'], required: true })
  paymentMethodType: 'cash' | 'card';

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paidAt: Date;

  @Prop({ default: false })
  isDelivered: boolean;

  @Prop()
  deliveredAt: Date;

  @Prop({
    type: {
      alias: String,
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    required: true,
  })
  shippingAddress: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };

  @Prop()
  paymentIntentId?: string;

  @Prop({ default: false })
  paymentFailed?: boolean;

  @Prop()
  paidAmount?: number;

  @Prop()
  currency?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ user: 1 });
OrderSchema.index({ createdAt: -1 });
