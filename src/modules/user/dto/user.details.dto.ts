import { IsNotEmpty } from 'class-validator';

export class UserDetailsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  status: string;
}
