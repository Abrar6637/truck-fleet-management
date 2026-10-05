export type TruckLocationStatus =
  | "moving"
  | "stopped"
  | "offline";

export interface TruckLocation {
  id: number;

  truckId: number;
  driverId?: number;
  tripId?: number;

  latitude: number;
  longitude: number;

  speedKph: number;
  heading?: number;

  status: TruckLocationStatus;

  address?: string;

  recordedAt: string;
}