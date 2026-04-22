import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase().trim())
  code: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  expireDate: string;

  @IsOptional()
  @IsNumber()
  maxUsage?: number = 1;

  @IsNumber()
  @Min(0, { message: 'discount must be at least 0' })
  @Max(100)
  discount: number;
}
