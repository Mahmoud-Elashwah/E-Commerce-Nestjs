import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type productDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    minlength: 3,
  })
  title: string;

  @Prop({
    type: String,
    minlength: 20,
    required: true,
  })
  description: string;

  @Prop({
    type: Number,
    min: 1,
    max: 20,
    default: 1,
    required: true,
  })
  quantity: number;

  @Prop({ type: String, required: true })
  imageCover: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Number, default: 0, min: 0 })
  priceAfterDiscount: number;

  @Prop({ type: String })
  color: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' })
  subCategory: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
  brand: string;

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  ratingAverage?: number;

  @Prop({ type: Number, default: 0 })
  ratingQuantity?: number;
}

export const productSchema = SchemaFactory.createForClass(Product);

productSchema.index({ title: 1, color: 1 }, { unique: true });
