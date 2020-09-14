import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';
import { RoleType } from './roletype.enum';
import { status } from '../../shared/entity-status.num';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  public async getOrCreateDefaultRole(): Promise<Role> {
    let role = await this._roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });

    if (!role) {
      role = await this._roleRepository.save({ name: RoleType.GENERAL });
    }

    return role;
  }

  public async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!role) {
      throw new NotFoundException('Role does not exist');
    }

    return role;
  }

  public async getAll(): Promise<Role[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: status.ACTIVE },
    });

    return roles;
  }

  public async create({ name, description }: Role): Promise<Role> {
    const savedRole: Role = await this._roleRepository.save({
      name,
      description,
    });

    return savedRole;
  }

  public async update(id: number, role: Role): Promise<void> {
    await this._roleRepository.update(id, role);
  }

  public async delete(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!roleExists) {
      throw new NotFoundException('Role does not exist');
    }

    await this._roleRepository.update(id, { status: 'INACTIVE' });
  }
}
