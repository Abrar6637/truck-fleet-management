import { TripStatus } from "@/types/trip";

export const tripStatusLabels: Record<TripStatus, string> = {
  created: "Created",
  assigned: "Assigned",
  started: "Started",
  in_transit: "In Transit",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const nextTripStatus: Partial<Record<TripStatus, TripStatus>> = {
  created: "assigned",
  assigned: "started",
  started: "in_transit",
  in_transit: "delivered",
  delivered: "completed",
};

export function getNextTripStatus(
  currentStatus: TripStatus
): TripStatus | null {
  return nextTripStatus[currentStatus] ?? null;
}

export function canCancelTrip(
  currentStatus: TripStatus
): boolean {
  return ["created", "assigned"].includes(currentStatus);
}

export function isTripFinished(
  currentStatus: TripStatus
): boolean {
  return ["completed", "cancelled"].includes(currentStatus);
}