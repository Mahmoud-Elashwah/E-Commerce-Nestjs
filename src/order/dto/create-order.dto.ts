import {
  IsArray,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsMongoId()
  @IsNotEmpty()
  product: string;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  priceAfterDiscount?: number;
}

class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  postalCode?: string;
}

export class CreateOrderDto {
  @IsEnum(['cash', 'card'])
  paymentMethodType: 'cash' | 'card';

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
