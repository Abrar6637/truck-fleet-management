import { TripStatus } from "@/types/trip";

export interface TripStatusHistory {
  id: number;
  tripId: number;

  oldStatus?: TripStatus;
  newStatus: TripStatus;

  changedBy: string;
  changedAt: string;

  notes?: string;

  latitude?: number;
  longitude?: number;
}