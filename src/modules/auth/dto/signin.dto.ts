import { IsNotEmpty, IsString } from 'class-validator';

export class SingInDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
