export enum ReservationStatus {
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
  DENIED = 'DENIED',
}

export enum ReservationKind {
  NORMAL = 'NORMAL',
  LEASE = 'LEASE',
}

export class CreateReservationDto {
  kind = ReservationKind.NORMAL;
  inventory: string;
  fromDate: Date;
  toDate: Date;
  reservedBy: string;
}

export class CreatedReservationDto extends CreateReservationDto {
  status: ReservationStatus = ReservationStatus.PENDING;
}

export class PatchReservationDto extends CreatedReservationDto {}
