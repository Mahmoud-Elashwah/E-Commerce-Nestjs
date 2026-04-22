import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReqProductDto {
  @IsString({ message: 'titleNeed must be a string' })
  @IsNotEmpty()
  titleNeed: string;

  @IsString({ message: 'details must be a string' })
  @IsNotEmpty()
  @MinLength(2, { message: 'details must be at least 2 characters long' })
  details: string;

  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsString({ message: 'category must be a string' })
  @IsOptional()
  category: string;

  // @IsString({ message: 'user must be a string' })
  // @IsNotEmpty()
  // @IsMongoId({ message: 'user must be a valid MongoDB ID' })
  // user: string;
}
