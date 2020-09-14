import { Repository, EntityRepository } from 'typeorm';
import { User } from '../user/user.entity';
import { SingUpDto } from './dto';
import { hash, genSalt } from 'bcryptjs';
import { Role } from '../role/role.entity';

import { UserDetails } from '../user/user-details/user.details.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(
    { username, email, password }: SingUpDto,
    role: Role,
    details: UserDetails,
  ) {
    const user = new User();
    user.username = username;
    user.email = email;

    user.roles = [role];
    user.details = details;

    user.password = await this.cryptPassword(password);

    user.save();
  }

  async cryptPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
}
