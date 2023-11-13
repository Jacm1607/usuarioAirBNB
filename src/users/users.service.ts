import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { UserInterface } from 'src/app.controller';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async find() {
    return await this.userRepository.find();
  }

  findOne(request: any) {
    return this.userRepository.find({
      where: { username: request.usr },
    });
  }

  async create(request: UserInterface) {
    try {
      const saltOrRounds = 10;
      const password = request.pwd;
      const hash = await bcrypt.hash(password, saltOrRounds);
      return await this.userRepository.save({
        username: request.usr,
        password: hash,
      });
    } catch (error) {
      return new Error(error);
    }
  }
}
