export type TripPaymentType =
  | "advance"
  | "partial"
  | "final";

export type TripPaymentMethod =
  | "cash"
  | "bank_transfer"
  | "jazzcash"
  | "easypaisa"
  | "cheque"
  | "other";

export interface TripPayment {
  id: number;

  // Related trip
  tripId: number;

  // Payment details
  amount: number;
  paymentType: TripPaymentType;
  paymentMethod: TripPaymentMethod;
  paymentDate: string;

  // Optional transaction/reference number
  referenceNumber?: string;

  // Optional notes
  notes?: string;

  // Audit
  createdBy: string;
  createdAt: string;
}