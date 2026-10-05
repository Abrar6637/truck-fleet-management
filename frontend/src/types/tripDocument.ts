export type TripDocumentType =
  | "proof_of_delivery"
  | "delivery_challan"
  | "invoice"
  | "bilty"
  | "gate_pass"
  | "weight_slip"
  | "other";

export type TripDocumentVerificationStatus =
  | "pending"
  | "verified"
  | "rejected";

export interface TripDocument {
  id: number;
  tripId: number;

  documentType: TripDocumentType;
  documentNumber?: string;

  fileName?: string;
  fileUrl?: string;

  verificationStatus: TripDocumentVerificationStatus;

  notes?: string;

  uploadedBy: string;
  uploadedAt: string;
}