import { IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class UpdateOrderDto {
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsBoolean()
  @IsOptional()
  isDelivered?: boolean;

  @IsDateString()
  @IsOptional()
  paidAt?: Date;

  @IsDateString()
  @IsOptional()
  deliveredAt?: Date;
}
