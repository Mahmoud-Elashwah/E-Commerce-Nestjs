import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCartDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number = 1;
}
