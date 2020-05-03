export enum ReservationStatus {
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
  DENIED = 'DENIED',
}

export class CreateReservationDto {
  inventory: string;
  fromDate: Date;
  toDate: Date;
  reservedBy: string;
}

export class CreatedReservationDto extends CreateReservationDto {
  status: ReservationStatus = ReservationStatus.PENDING;
}

export class PatchReservationDto extends CreatedReservationDto {}
