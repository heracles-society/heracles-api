export class CreateOrganizationDto {
  name: string;
  description: string;
  owners: string[];
}

export class CreatedOrganization extends CreateOrganizationDto {}
