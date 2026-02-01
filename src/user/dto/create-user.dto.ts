import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  MaxLength,
  min,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  //name
  @IsString({ message: 'Name must be a String' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 3 characters' })
  name: string;

  //email
  @IsString({ message: 'email must be a String' })
  @IsEmail({}, { message: 'Email is not valid' })
  @MinLength(0, { message: 'The Email must be required' })
  email: string;

  //password
  @IsString({ message: 'Password must be a String' })
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(30, { message: 'Password must be at most 3 characters' })
  password: string;

  //role
  @IsEnum(['admin', 'admin'], { message: 'Role must be user or admin' })
  role: string;

  // avatar
  @IsString({ message: 'avatar must be a String' })
  @IsUrl({}, { message: 'avatar must be a valid URL' })
  avatar: string;

  // age
  @IsNumber({}, { message: 'age must be a Number' })
  @Min(18, { message: 'age must be at least 18 years old' })
  age: number;

  // phoneNumber
  @IsNumber({}, { message: 'PhoneNumber must be a Number' })
  @IsPhoneNumber('EG', { message: 'phone number not valid' })
  phoneNumber: number;

  // address
  @IsString({ message: 'address must be a String' })
  address: string;

  //   active
  @IsBoolean({ message: 'Active must be boolean' })
  @IsEnum([true, false], { message: 'active must be true or false' })
  active: boolean;

  // VerificationCode
  @IsString({ message: 'VerificationCode must be a String' })
  @Length(6, 6, { message: 'VerificationCode must be at least 6 characters' })
  VerificationCode: string;

  // gender
  @IsEnum(['male', 'female'], { message: 'gender must be male or female' })
  gender: string;
}
