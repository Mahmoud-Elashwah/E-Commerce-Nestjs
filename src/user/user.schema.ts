import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [30, 'Name must be at most 30 characters'],
  })
  name: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({
    required: true,
    type: String,
    minlength: [3, 'password must be at least 3 characters'],
  })
  password: string;
  @Prop({
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;
  @Prop({
    type: String,
  })
  avatar: string;
  @Prop({
    type: Number,
  })
  age: number;
  @Prop({
    type: String,
    length: 11,
  })
  phoneNumber: string;
  @Prop({
    type: String,
  })
  address: string;
  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;
  @Prop({
    type: String,
  })
  VerificationCode: string;
  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: string;
  @Prop({ type: String })
  resetPasswordToken?: string;

  @Prop({ type: Date })
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
