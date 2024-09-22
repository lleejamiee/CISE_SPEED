import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { error } from 'console';
import { CreateUserDto } from './create-user.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/test')
  test() {
    return this.userService.test();
  }

  // Create & add a user
  @Get('/')
  async addUser(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.createUser(createUserDto);
      return { meaage: 'User added successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to add this user',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // Find a user by username
  @Get('/:username')
  async findUserByUsername(@Param('username') username: String) {
    try {
      return this.userService.getUserByUsername(username);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No User found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Find a user by email
  @Get('/:username')
  async findUserByEmail(@Param('email') email: String) {
    try {
      return this.userService.getUserByEmail(email);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No User found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
