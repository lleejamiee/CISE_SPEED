import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  test(): String {
    return 'user route testing';
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async getUserBySessionToke(sessionToken: String): Promise<User> {
    return await this.userModel.findOne({
      'authentication.sessionToken': sessionToken,
    });
  }

  async getUserByUsername(username: String): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async getUserByEmail(email: String): Promise<User> {
    return await this.userModel.findOne({ email });
  }
}
