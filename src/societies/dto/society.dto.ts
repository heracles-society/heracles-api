export class CreateSocietyDto {
  name: string;
  organization: string;
  address: string;
  state: string;
  highlights: string;
  happinessIndex: number;
  safetyIndex: number;
  area: number;
  areaUnit: string;
  latitude: string;
  longitude: string;
  managers: string[];
}

export class CreatedSocietyDto extends CreateSocietyDto {}
