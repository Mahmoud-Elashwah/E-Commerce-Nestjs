import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString({ message: 'name must be a string' })
  @MaxLength(20, { message: 'name must be at most 100 characters' })
  name: string;
  @IsString({ message: 'image must be a string' })
  @IsUrl({}, { message: 'image must be a valid URL' })
  image: string;
}
