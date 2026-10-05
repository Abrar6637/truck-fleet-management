export type TruckDocumentType =
  | "registration"
  | "fitness_certificate"
  | "route_permit"
  | "insurance"
  | "token_tax"
  | "other";

export type DocumentVerificationStatus =
  | "pending"
  | "verified"
  | "rejected";

export interface TruckDocument {
  id: number;

  truckId: number;

  documentType: TruckDocumentType;
  documentNumber: string;

  issueDate?: string;
  expiryDate?: string;

  issuingAuthority?: string;

  fileName?: string;
  fileUrl?: string;

  verificationStatus: DocumentVerificationStatus;

  notes?: string;

  createdBy: string;
  createdAt: string;
}