export class CreateUserDto {
  name: string;
  email: string;
  roles: string[];
  familyName?: string;
  givenName?: string;
  picture?: string;
  openId?: string;
}

export class CreatedUserDto extends CreateUserDto {}
