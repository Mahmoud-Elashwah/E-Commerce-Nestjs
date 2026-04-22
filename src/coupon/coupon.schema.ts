import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type couponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    required: true,
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  })
  code: string;

  @Prop({
    type: Date,
    default: () => Date.now() + 1000 * 60 * 60 * 24 * 5,
  })
  expireDate: Date;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    required: true,
  })
  discount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ default: 1 })
  maxUsage: number;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
