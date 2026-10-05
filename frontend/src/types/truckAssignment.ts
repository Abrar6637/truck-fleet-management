export type TruckAssignmentStatus =
  | "active"
  | "completed";

export interface TruckAssignment {
  id: number;

  truckId: number;
  driverId: number;

  assignedAt: string;
  unassignedAt?: string;

  status: TruckAssignmentStatus;

  notes?: string;

  createdBy: string;
}