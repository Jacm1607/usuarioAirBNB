import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: any, pass: any): Promise<any> {
    console.log(username, pass);
    const [user] = await this.usersService.findOne({ usr: username });
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      return this.login(user);
    }
    throw new UnauthorizedException();
    return null;
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
