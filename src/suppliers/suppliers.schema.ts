import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type suppliersDocument = HydratedDocument<Suppliers>;

@Schema({ timestamps: true })
export class Suppliers {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  name: string;
  @Prop({
    type: String,
    required: true,
  })
  website: string;
}
export const suppliersSchema = SchemaFactory.createForClass(Suppliers);
