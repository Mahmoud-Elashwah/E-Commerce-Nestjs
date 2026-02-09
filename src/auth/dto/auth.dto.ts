import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEnum,
  IsUrl,
  IsOptional,
  Min,
  IsPhoneNumber,
  Length,
  IsBoolean,
} from 'class-validator';

export class SignUpDto {
  // name
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  name: string;

  // email
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // password
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  password: string;

  // confirm password
  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @MinLength(5, { message: 'Confirm password must be at least 5 characters' })
  confirmPassword: string;

  @IsEnum(['user', 'admin'], { message: 'Role must be user or admin' })
  @IsOptional()
  role?: string;
  // avatar
  @IsString({ message: 'avatar must be a String' })
  @IsUrl({}, { message: 'avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  // age
  @Min(18, { message: 'age must be at least 18 years old' })
  @IsOptional()
  age?: number;

  // phoneNumber
  @IsString({ message: 'PhoneNumber must be a String' })
  @IsPhoneNumber('EG', { message: 'phone number not valid' })
  @IsOptional()
  phoneNumber?: string;

  // address
  @IsString({ message: 'address must be a String' })
  @IsOptional()
  address?: string;

  //   active
  @IsBoolean({ message: 'active must be true or false' })
  @IsOptional()
  active?: boolean;

  // VerificationCode
  @IsString({ message: 'VerificationCode must be a String' })
  @Length(6, 6, { message: 'VerificationCode must be at least 6 characters' })
  @IsOptional()
  VerificationCode?: string;

  // gender
  @IsEnum(['male', 'female'], { message: 'gender must be male or female' })
  @IsOptional()
  gender?: string;
}

export class signInDto {
  //email
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // password
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  password: string;
}
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
export class ResetPasswordDto {
  // @IsString()
  // @IsNotEmpty({ message: 'Token is required' })
  // token: string;

  @MinLength(8)
  newPassword: string;
}
