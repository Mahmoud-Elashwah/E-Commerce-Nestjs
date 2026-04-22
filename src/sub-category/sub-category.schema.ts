import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/category.schema';

export type subCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  name: string;
  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string;
}

export const subCategorySchema = SchemaFactory.createForClass(SubCategory);
