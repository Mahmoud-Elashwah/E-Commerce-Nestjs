import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(20)
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @Transform(({ value }) => value ?? 1)
  @Min(1)
  @Max(20)
  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  imageCover: string;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 0)
  @IsNumber()
  sold?: number;

  @Type(() => Number)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 0)
  @Min(0)
  @IsNumber()
  priceAfterDiscount?: number;

  @IsOptional()
  @IsString({ each: true })
  color?: string;

  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsMongoId()
  subCategory?: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  @IsNumber()
  ratingAverage?: number;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 0)
  @Min(0)
  @IsNumber()
  ratingQuantity?: number;
}
