export class CreateUserDto {
  name: string;
  mobile: string;
  email: string;
}

export class CreatedUserDto extends CreateUserDto {}
