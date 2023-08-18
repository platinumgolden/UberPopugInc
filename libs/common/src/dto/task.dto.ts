import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  date: string;

  @IsNumber()
  price: number;

  @IsString()
  status: string;
}
