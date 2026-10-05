export type DriverDocumentType =
  | "driving_license"
  | "cnic"
  | "medical_certificate"
  | "police_verification"
  | "other";

export type DriverDocumentVerificationStatus =
  | "pending"
  | "verified"
  | "rejected";

export interface DriverDocument {
  id: number;

  driverId: number;

  documentType: DriverDocumentType;
  documentNumber: string;

  issueDate?: string;
  expiryDate?: string;

  issuingAuthority?: string;

  fileName?: string;
  fileUrl?: string;

  verificationStatus: DriverDocumentVerificationStatus;

  notes?: string;

  createdBy: string;
  createdAt: string;
}