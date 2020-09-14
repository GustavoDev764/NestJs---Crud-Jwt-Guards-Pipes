import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetailsRepository } from './user.details.repository';
import { UserDetails } from './user.details.entity';

interface RequesteCreate {
  name?: string;
  lastname?: string;
}

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetailsRepository)
    private readonly _userDetailsRepository: UserDetailsRepository,
  ) {}

  async create({
    name = '',
    lastname = '',
  }: RequesteCreate): Promise<UserDetails> {
    const details = await this._userDetailsRepository.save({ name, lastname });

    return details;
  }
}
