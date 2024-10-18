import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, LoginCredentialDto } from './user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.schema';

jest.mock('../../utilities/encryption', () => ({
  random: jest.fn().mockReturnValue('randomSalt'),
  authentication: jest.fn().mockReturnValue('hashedPassword'),
}));

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('addUser', () => {
    it('should throw a BAD_REQUEST exception if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existinguser@example.com',
        username: 'existinguser',
        authentication: {
          password: 'password',
          salt: '',
          sessionToken: '',
        },
        role: 'user',
      };

      jest
        .spyOn(userController, 'findUserByEmail')
        .mockResolvedValueOnce({ ...createUserDto });

      await expect(userController.addUser(createUserDto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });

    //     it('should create a user successfully', async () => {
    //       const createUserDto: CreateUserDto = {
    //         email: 'newuser@example.com',
    //         username: 'newuser',
    //         authentication: {
    //           password: 'password',
    //           salt: '',
    //           sessionToken: '',
    //         },
    //         role: 'user',
    //       };

    //       jest.spyOn(userController, 'findUserByEmail').mockResolvedValueOnce(null);
    //       await expect(userController.addUser(createUserDto)).resolves.toEqual({
    //         meaage: 'User added successfully',
    //       });
    //     });
  });

  //   describe('authenticateUser', () => {
  //     it('should return user if authentication is successful', async () => {
  //       const loginCredential: LoginCredentialDto = {
  //         identity: 'existinguser@example.com',
  //         password: 'password',
  //       };

  //       const user: User = {
  //         username: 'existinguser',
  //         email: 'existinguser@example.com',
  //         role: 'user',
  //         authentication: {
  //           salt: 'randomSalt',
  //           password: 'hashedPassword',
  //           sessionToken: '',
  //         },
  //       };

  //       jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(user);

  //       await expect(
  //         userController.authenticateUser(loginCredential),
  //       ).resolves.toEqual(user);
  //     });

  //     it('should throw a NOT_FOUND exception if user does not exist', async () => {
  //       const loginCredential: LoginCredentialDto = {
  //         identity: 'nonexistent@example.com',
  //         password: 'password',
  //       };

  //       jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);
  //       await expect(
  //         userController.authenticateUser(loginCredential),
  //       ).rejects.toThrow(
  //         new HttpException('No User found', HttpStatus.NOT_FOUND),
  //       );
  //     });

  //     it('should throw UNAUTHORIZED exception for wrong password', async () => {
  //       const loginCredential: LoginCredentialDto = {
  //         identity: 'existinguser@example.com',
  //         password: 'wrongpassword',
  //       };

  //       const user: User = {
  //         username: 'existinguser',
  //         email: 'existinguser@example.com',
  //         role: 'user',
  //         authentication: {
  //           salt: 'randomSalt',
  //           password: 'hashedPassword',
  //           sessionToken: '',
  //         },
  //       };

  //       jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(user);
  //       await expect(
  //         userController.authenticateUser(loginCredential),
  //       ).rejects.toThrow(
  //         new HttpException('Wrong password', HttpStatus.UNAUTHORIZED),
  //       );
  //     });
  //   });

  //   describe('findUserByEmail', () => {
  //     it('should return a user by email', async () => {
  //       const email = 'user@example.com';

  //       const user: User = {
  //         username: 'existinguser',
  //         email: 'user@example.com',
  //         role: 'user',
  //         authentication: {
  //           salt: 'randomSalt',
  //           password: 'hashedPassword',
  //           sessionToken: '',
  //         },
  //       };

  //       jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(user);
  //       await expect(userController.findUserByEmail(email)).resolves.toEqual(
  //         user,
  //       );
  //     });

  //     it('should throw NOT_FOUND exception if user is not found', async () => {
  //       const email = 'nonexistent@example.com';

  //       jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);
  //       await expect(userController.findUserByEmail(email)).rejects.toThrow(
  //         new HttpException('No User found', HttpStatus.NOT_FOUND),
  //       );
  //     });
  //   });

  //   describe('findUserByUsername', () => {
  //     it('should return a user by username', async () => {
  //       const username = 'user';

  //       const user: User = {
  //         username: 'existinguser',
  //         email: 'user@example.com',
  //         role: 'user',
  //         authentication: {
  //           salt: 'randomSalt',
  //           password: 'hashedPassword',
  //           sessionToken: '',
  //         },
  //       };

  //       jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(user);
  //       await expect(
  //         userController.findUserByUsername(username),
  //       ).resolves.toEqual(user);
  //     });

  //     it('should throw NOT_FOUND exception if user is not found', async () => {
  //       const username = 'nonexistentuser';

  //       jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);
  //       await expect(userController.findUserByUsername(username)).rejects.toThrow(
  //         new HttpException('No User found', HttpStatus.NOT_FOUND),
  //       );
  //     });
  //   });
});
