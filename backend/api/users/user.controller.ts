import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { error } from 'console';
import { CreateUserDto, LoginCredentialDto } from './user.dto';
import { authentication, random } from 'utilities/encryption';
import { User } from './user.schema';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/test')
  test() {
    return this.userService.test();
  }

  // Create & add a user
  @Post('/')
  async addUser(@Body() createUserDto: CreateUserDto) {
    try {
      // Check if email, username, password, and role fields are filled in
      if (
        !createUserDto.email ||
        !createUserDto.username ||
        !createUserDto.authentication.password ||
        !createUserDto.role
      ) {
        console.log('Inside the first if statement');
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'All required fields must be filled',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the user with the same email address already exists
      const existingUser = await this.findUserByEmail(createUserDto.email);

      if (existingUser) {
        console.log('inside exisiting user check if statement');
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'User already exists' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Salting password to enhance security
      const salt = random();
      createUserDto.authentication.salt = salt;
      const saltedPassword = authentication(
        salt,
        createUserDto.authentication.password,
      );
      console.log('salted password: ' + saltedPassword);
      createUserDto.authentication.password = saltedPassword;

      // Create user
      await this.userService.createUser(createUserDto);
      return { meaage: 'User added successfully' };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to add this user',
        },
        HttpStatus.BAD_REQUEST,
        { cause: err },
      );
    }
  }

  // Login with username
  @Get('/login')
  async authenticateUser(@Body() loginCredential: LoginCredentialDto) {
    try {
      if (loginCredential.email && loginCredential.authentication.password) {
        const user = this.userService.getUserByEmail(loginCredential.email);
      } else if (
        loginCredential.username &&
        loginCredential.authentication.password
      ) {
        const user = this.userService.getUserByUsername(
          loginCredential.username,
        );
      }

      return this.userService.getUserByUsername(loginCredential.username);
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
  @Get('/:email')
  async findUserByEmail(@Param('email') email: string) {
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

  // Find a user by username
  @Get('/:username')
  async findUserByUsername(@Param('username') username: string) {
    try {
      return this.userService.getUserByEmail(username);
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

function authenticateUser(user: User, loginCredential: LoginCredentialDto) {
  const expectedHash = authentication(
    user.authentication.salt,
    loginCredential.authentication.password,
  );

  if (user.authentication.password !== expectedHash) {
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Wrong password',
      },
      HttpStatus.UNAUTHORIZED,
      { cause: error },
    );
  }

  const salt = random();
  user.authentication.sessionToken = authentication(salt, user._id.toString());

  // await user.save();
  // res.cookie('SPEED-AUTH', user.authentication.sessionToken, {
  //   domain: 'localhost',
  //   path: '/',
  // });
  // return res.status(200).json(user).end();
}
