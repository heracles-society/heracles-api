export class CreateOrganizationDto {
  name: string;
  description: string;
}

export class CreatedOrganization extends CreateOrganizationDto {}
