import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Body } from '@nestjs/common/decorators';
import { UsersService } from './users/users.service';

export interface UserInterface {
  usr: string;
  pwd: string;
}

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() req: UserInterface) {
    return await this.authService.validateUser(req.usr, req.pwd);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('user/create')
  async create(@Body() req: UserInterface) {
    try {
      return await this.userService.create(req);
    } catch (e) {
      return { error: 'error' };
    }
  }

  @Get('user')
  get(@Body() req: any) {
    try {
      console.log(req);
      return this.userService.findOne(req);
    } catch (e) {
      return { error: 'error' };
    }
  }

  @Get('users')
  getAll() {
    try {
      return this.userService.find();
    } catch (e) {
      return { error: 'error' };
    }
  }
}
