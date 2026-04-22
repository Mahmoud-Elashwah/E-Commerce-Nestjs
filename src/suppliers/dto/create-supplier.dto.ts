import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsUrl()
  @IsNotEmpty()
  website: string;
}
