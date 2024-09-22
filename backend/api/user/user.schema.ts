import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Authentication {
  @Prop({ required: true, select: false })
  password: String;
  @Prop({ select: false })
  salt: String;
  @Prop({ select: false })
  sessionToken: String;
}

@Schema()
export class User {
  @Prop({ required: true })
  username: String;
  @Prop({ required: true })
  email: String;
  @Prop()
  authentication: Authentication;
  @Prop()
  role: String;
}

export const UserSchema = SchemaFactory.createForClass(User);
