export class CreateSocietyDto {
  readonly name: string;
  readonly organization: string;
}

export class CreatedSocietyDto extends CreateSocietyDto {}
