import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get('/')
  async getRoles(): Promise<Role[]> {
    const roles = await this._roleService.getAll();
    return roles;
  }

  @Get(':id')
  async getRole(@Param() id: number): Promise<Role> {
    const role = await this._roleService.get(id);
    return role;
  }

  @Post()
  async createdRole(@Body() role: Role): Promise<Role> {
    const createRole = await this._roleService.create(role);
    return createRole;
  }

  @Patch(':id')
  async updatedRole(@Param() id: number, @Body() role: Role): Promise<void> {
    await this._roleService.update(id, role);
  }

  @Delete(':id')
  async deleteRole(@Param() id: number): Promise<void> {
    await this._roleService.delete(id);
  }
}
