import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateOauthDto {
  // name - required
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  name: string;

  // email - required
  @IsEmail({}, { message: 'Email is not valid' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // role - optional
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  @IsOptional()
  role?: string;

  // avatar - optional
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  // age - optional
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(18, { message: 'Age must be at least 18' })
  @IsOptional()
  age?: number;

  // phoneNumber - optional
  @IsPhoneNumber('EG', { message: 'Phone number is not valid' })
  @IsOptional()
  phoneNumber?: string;

  // address - optional
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  // active - optional
  @IsBoolean({ message: 'Active must be true or false' })
  @IsOptional()
  active?: boolean;

  // gender - optional
  @IsEnum(['male', 'female'], {
    message: 'Gender must be either male or female',
  })
  @IsOptional()
  gender?: string;
}
