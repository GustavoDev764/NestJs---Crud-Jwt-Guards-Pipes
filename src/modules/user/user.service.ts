import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserDetailsService } from './user-details/user-details.service';
import { RoleService } from '../role/role.service';
import { status } from '../../shared/entity-status.num';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    private readonly _userDetailsService: UserDetailsService,
    private readonly _roleService: RoleService,
  ) {}

  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users;
  }

  async create(user: User): Promise<User> {
    user.details = await this._userDetailsService.create({});

    const defaultRole = await this._roleService.getOrCreateDefaultRole();

    user.roles = [defaultRole];

    const savedUser: User = await this._userRepository.save(user);

    return savedUser;
  }

  async update(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    const userExists = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    await this._userRepository.update(id, { status: status.INATIVE });
  }

  async setRoleToUser(userId: number, roleId: number) {
    const userExist = await this.get(userId);
    const roleExist = await this._roleService.get(roleId);

    userExist.roles.forEach(role => {
      if (role.name === roleExist.name) {
        throw new NotFoundException('Role already exists in user');
      }
    });

    userExist.roles.push(roleExist);
    await this._userRepository.save(userExist);

    return true;
  }
}
