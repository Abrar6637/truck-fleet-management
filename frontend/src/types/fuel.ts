export interface FuelEntry {
  id: number;

  truckId: number;
  driverId?: number;
  tripId?: number;

  fuelDate: string;

  fuelStation: string;

  litres: number;
  pricePerLitre: number;
  totalAmount: number;

  odometerKm: number;

  receiptNumber?: string;
  receiptImage?: string;

  notes?: string;

  createdBy: string;
  createdAt: string;
}