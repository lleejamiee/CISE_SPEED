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

export class LoginCredentialDto {
  identity: string;
  password: string;
}

export class AuthenticatedUser {
  username: string;
  role: string;
}
