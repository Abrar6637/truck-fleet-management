export type TripStatus =
  | "created"
  | "assigned"
  | "started"
  | "in_transit"
  | "delivered"
  | "completed"
  | "cancelled";

export interface Trip {
  id: number;

  tripNumber: string;

  truckId: number;
  driverId: number;

  origin: string;
  destination: string;

  pickupLatitude?: number;
  pickupLongitude?: number;

  destinationLatitude?: number;
  destinationLongitude?: number;

  startDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;

  goodsType: string;
  goodsDescription?: string;

  loadedWeightKg: number;

 // Pickup / Shipper Details
pickupCompanyName: string;
pickupContactPerson?: string;
pickupPhone?: string;
pickupAddress?: string;

// Delivery / Receiver Details
deliveryCompanyName: string;
deliveryContactPerson?: string;
deliveryPhone?: string;
deliveryAddress?: string;

  tripAmount: number;

  status: TripStatus;

  notes?: string;

  createdBy: string;
}