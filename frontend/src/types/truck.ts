export type TruckStatus =
  | "available"
  | "assigned"
  | "on_trip"
  | "maintenance"
  | "breakdown"
  | "inactive";

export interface Truck {
  id: number;

  registrationNumber: string;
  truckNumber?: string;

  truckType: string;
  manufacturer: string;
  model: string;
  modelYear: number;

  capacityKg: number;

  engineNumber: string;
  chassisNumber: string;

  purchaseDate: string;
  purchasePrice: number;

  currentOdometerKm: number;

  status: TruckStatus;

  assignedDriver?: string;

  notes?: string;
}