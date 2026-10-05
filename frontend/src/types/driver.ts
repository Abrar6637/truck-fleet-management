export type DriverStatus =
  | "available"
  | "assigned"
  | "on_trip"
  | "on_leave"
  | "inactive";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "expired";

export interface Driver {
  id: number;

  name: string;
  phone: string;
  email?: string;

  cnic: string;
  dateOfBirth: string;
  address: string;

  emergencyContactName: string;
  emergencyContactPhone: string;

  joiningDate: string;
  baseSalary: number;

  licenseNumber: string;
  licenseExpiryDate: string;
  licenseVerificationStatus: VerificationStatus;

  status: DriverStatus;

  assignedTruckId?: number;
  assignedTruckRegistration?: string;

  profileImage?: string;
  notes?: string;
}