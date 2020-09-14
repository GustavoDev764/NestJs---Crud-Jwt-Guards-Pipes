import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SingUpDto, SingInDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() singUpDto: SingUpDto): Promise<void> {
    return this._authService.signup(singUpDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() singInDto: SingInDto) {
    return this._authService.signin(singInDto);
  }
}
