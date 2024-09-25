import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  test(): string {
    return 'user route testing';
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async getUserBySessionToke(sessionToken: string): Promise<User> {
    return await this.userModel.findOne({
      'authentication.sessionToken': sessionToken,
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
}
