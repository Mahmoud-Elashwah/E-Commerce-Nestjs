import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type brandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  name: string;
  @Prop({
    type: String,
  })
  image: string;
}

export const brandSchema = SchemaFactory.createForClass(Brand);
