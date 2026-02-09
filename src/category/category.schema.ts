import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
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

export const categorySchema = SchemaFactory.createForClass(Category);
