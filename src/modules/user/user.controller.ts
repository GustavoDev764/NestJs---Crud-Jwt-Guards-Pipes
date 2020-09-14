import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  // @Roles(RoleType.ADMIN)
  // @UseGuards(AuthGuard(), RoleGuard)
  @Get('/')
  async getUsers(): Promise<User[]> {
    const users = await this._userService.getAll();
    return users;
  }

  @Get(':id')
  async getUser(@Param() id: number): Promise<User> {
    const user = await this._userService.get(id);
    return user;
  }

  @Post()
  async createdUser(@Body() user: User): Promise<User> {
    const createdUser = await this._userService.create(user);
    return createdUser;
  }

  @Patch(':id')
  async updatedUser(@Param() id: number, @Body() user: User): Promise<void> {
    await this._userService.update(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param() id: number): Promise<void> {
    await this._userService.delete(id);
  }

  @Post('set-role/:userId/:roleId')
  async setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
