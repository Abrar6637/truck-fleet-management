export type TyreStatus =
  | "in_stock"
  | "installed"
  | "under_repair"
  | "retired";

export type TyreCondition =
  | "new"
  | "good"
  | "fair"
  | "poor"
  | "damaged";

export interface Tyre {
  id: number;

  tyreNumber: string;
  brand: string;
  model?: string;
  size: string;
  serialNumber?: string;

  purchaseDate: string;
  purchasePrice: number;

  status: TyreStatus;
  condition: TyreCondition;

  initialOdometerKm?: number;
  currentMileageKm: number;

  expectedLifeKm?: number;

  supplierName?: string;
  warrantyExpiryDate?: string;

  notes?: string;

  createdBy: string;
  createdAt: string;
}

export type TyrePosition =
  | "front_left"
  | "front_right"
  | "rear_left_inner"
  | "rear_left_outer"
  | "rear_right_inner"
  | "rear_right_outer"
  | "spare";

export type TyreAssignmentStatus =
  | "active"
  | "removed";

export interface TyreAssignment {
  id: number;

  tyreId: number;
  truckId: number;

  position: TyrePosition;

  installedAt: string;
  installedOdometerKm: number;

  removedAt?: string;
  removedOdometerKm?: number;
  removalReason?: string;

  status: TyreAssignmentStatus;

  createdBy: string;
  createdAt: string;
}