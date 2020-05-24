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
  longiture: string;
  managers: string[];
}

export class CreatedSocietyDto extends CreateSocietyDto {}
