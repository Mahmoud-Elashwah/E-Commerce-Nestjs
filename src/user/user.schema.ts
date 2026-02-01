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
    maxlength: [30, 'password must be at least 30 characters'],
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
    type: Number,
    length: 11,
  })
  phoneNumber: number;
  @Prop({
    type: String,
  })
  address: string;
  @Prop({
    type: Boolean,
    enum: [true, false],
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
}

export const UserSchema = SchemaFactory.createForClass(User);
