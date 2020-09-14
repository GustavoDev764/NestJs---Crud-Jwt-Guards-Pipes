import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IJwtPayload } from '../../auth/jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const userJwt: IJwtPayload = user;

    const hasRole = () =>
      userJwt.roles.some((role: string) => roles.includes(role));

    return user && user.roles && hasRole();
  }
}
