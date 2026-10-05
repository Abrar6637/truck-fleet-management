export type OdometerSource =
  | "manual"
  | "trip_start"
  | "trip_end"
  | "fuel"
  | "maintenance";

export interface OdometerLog {
  id: number;

  truckId: number;

  odometerKm: number;

  source: OdometerSource;

  tripId?: number;
  fuelEntryId?: number;
  maintenanceRecordId?: number;

  recordedAt: string;

  notes?: string;

  recordedBy: string;
  createdAt: string;
}