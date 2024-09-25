import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Authentication {
  @Prop({ required: true, select: false })
  password: string;
  @Prop({ select: false })
  salt: string;
  @Prop({ select: false })
  sessionToken: string;
}

@Schema()
export class User {
  @Prop()
  _id: string;
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  authentication: Authentication;
  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
