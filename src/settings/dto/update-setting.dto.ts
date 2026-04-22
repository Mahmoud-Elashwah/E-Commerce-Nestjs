import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(50)
  taxPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  shippingPrice?: number;
}
