import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SingUpDto, SingInDto } from './dto';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';
import { RoleType } from '../role/roletype.enum';
import { RoleService } from '../role/role.service';
import { UserDetailsService } from '../user/user-details/user-details.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
    private readonly _roleService: RoleService,
    private readonly _userDetailsService: UserDetailsService,
  ) {}

  async signup(singUpDto: SingUpDto): Promise<void> {
    const { username, email } = singUpDto;

    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('username or email already exists');
    }
    const role = await this._roleService.getOrCreateDefaultRole();
    const details = await this._userDetailsService.create({});

    return this._authRepository.signup(singUpDto, role, details);
  }
  async signin(signin: SingInDto): Promise<{ token: string }> {
    const { username, password } = signin;
    const user = await this._authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map(r => r.name as RoleType),
    };
    const token = await this._jwtService.sign(payload);
    return { token };
  }
}
