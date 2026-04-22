import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type reqProductDocument = HydratedDocument<ReqProduct>;

@Schema({ timestamps: true })
export class ReqProduct {
  @Prop({
    required: true,
    type: String,
  })
  titleNeed: string;

  @Prop({
    type: String,
    minlength: 2,
    required: true,
  })
  details: string;

  @Prop({
    type: Number,
    min: 1,
    required: true,
  })
  quantity: number;

  @Prop({ type: String })
  category?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
}

export const reqProductSchema = SchemaFactory.createForClass(ReqProduct);
