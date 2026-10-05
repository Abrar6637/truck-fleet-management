export type MaintenanceType =
  | "oil_change"
  | "engine"
  | "brakes"
  | "transmission"
  | "electrical"
  | "suspension"
  | "body_work"
  | "general_service"
  | "emergency_repair"
  | "other";

export type MaintenanceStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface MaintenanceRecord {
  id: number;

  truckId: number;

  maintenanceType: MaintenanceType;
  status: MaintenanceStatus;

  serviceDate: string;
  odometerKm: number;

  workshopName: string;
  description: string;

  labourCost: number;
  partsCost: number;
  otherCost: number;

  nextServiceDate?: string;
  nextServiceOdometerKm?: number;

  receiptNumber?: string;
  receiptImage?: string;

  notes?: string;

  createdBy: string;
  createdAt: string;
}