import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true })
export class Settings {
  @Prop({
    type: Number,
    default: 1,
    min: 0,
    max: 50,
  })
  taxPercentage: number;

  @Prop({
    type: Number,
    default: 20,
    min: 0,
  })
  shippingPrice: number;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
