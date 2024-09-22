export class CreateUserDto {
  username: String;
  email: String;
  authentication: Authentication;
  role: String;
}

export class Authentication {
  password: String;
  salt: String;
  sessionToken: String;
}
