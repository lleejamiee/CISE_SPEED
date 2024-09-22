export class CreateUserDto {
  username: string;
  email: string;
  authentication: Authentication;
  role: string;
}

export class Authentication {
  password: string;
  salt: string;
  sessionToken: string;
}
