export interface Unit {
  id: string;
  name: string;
  address?: string;
  openTime?: string;
  closeTime?: string;
  capacity?: number;
  isActive?: boolean;
}

export interface Service {
  id: string;
  unitId: string;
  name: string;
  durationMinutes: number;
  bufferAfterMinutes: number;
  capacity: number;
  price?: number;
}

export interface Barber {
  id: string;
  name: string;
  contact?: string;
  units?: string[];
  isActive?: boolean;
  pin?: string;
}
