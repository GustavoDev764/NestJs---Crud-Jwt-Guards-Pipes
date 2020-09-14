import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.entity';

export class RoleDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  users?: User[];

  @IsNotEmpty()
  status?: string;

  @IsNotEmpty()
  createdAt?: Date;

  @IsNotEmpty()
  updatedAt?: Date;
}
