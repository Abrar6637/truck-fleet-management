import { Driver } from "@/types/driver";

export const drivers: Driver[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    phone: "0300-1234567",
    email: "ahmed.khan@example.com",

    cnic: "35202-1234567-1",
    dateOfBirth: "1988-05-14",
    address: "Lahore, Punjab",

    emergencyContactName: "Muhammad Imran",
    emergencyContactPhone: "0301-7654321",

    joiningDate: "2022-02-10",
    baseSalary: 65000,

    licenseNumber: "LHR-HTV-45821",
    licenseExpiryDate: "2027-05-20",
    licenseVerificationStatus: "verified",

    status: "on_trip",

    assignedTruckId: 1,
    assignedTruckRegistration: "LEC-4582",

    notes: "Experienced long-route driver.",
  },

  {
    id: 2,
    name: "Usman Ali",
    phone: "0302-2345678",
    email: "usman.ali@example.com",

    cnic: "35202-2345678-3",
    dateOfBirth: "1990-08-22",
    address: "Sheikhupura, Punjab",

    emergencyContactName: "Ali Hassan",
    emergencyContactPhone: "0303-8765432",

    joiningDate: "2022-07-15",
    baseSalary: 60000,

    licenseNumber: "LHR-HTV-92142",
    licenseExpiryDate: "2027-02-12",
    licenseVerificationStatus: "verified",

    status: "assigned",

    assignedTruckId: 2,
    assignedTruckRegistration: "LES-9214",
  },

  {
    id: 3,
    name: "Bilal Ahmad",
    phone: "0304-3456789",
    email: "bilal.ahmad@example.com",

    cnic: "33100-3456789-5",
    dateOfBirth: "1987-11-05",
    address: "Faisalabad, Punjab",

    emergencyContactName: "Zubair Ahmad",
    emergencyContactPhone: "0305-9876543",

    joiningDate: "2021-04-18",
    baseSalary: 68000,

    licenseNumber: "FSD-HTV-67313",
    licenseExpiryDate: "2028-01-15",
    licenseVerificationStatus: "verified",

    status: "on_trip",

    assignedTruckId: 3,
    assignedTruckRegistration: "LHR-6731",

    notes: "Experienced in heavy cargo transportation.",
  },

  {
    id: 4,
    name: "Hamza Iqbal",
    phone: "0306-4567890",

    cnic: "35202-4567890-7",
    dateOfBirth: "1992-03-17",
    address: "Lahore, Punjab",

    emergencyContactName: "Javed Iqbal",
    emergencyContactPhone: "0307-0987654",

    joiningDate: "2023-01-08",
    baseSalary: 58000,

    licenseNumber: "LHR-HTV-30454",
    licenseExpiryDate: "2026-10-18",
    licenseVerificationStatus: "verified",

    status: "assigned",

    assignedTruckId: 4,
    assignedTruckRegistration: "LEA-3045",
  },

  {
    id: 5,
    name: "Ali Raza",
    phone: "0308-5678901",
    email: "ali.raza@example.com",

    cnic: "35202-5678901-9",
    dateOfBirth: "1989-07-09",
    address: "Kasur, Punjab",

    emergencyContactName: "Asif Raza",
    emergencyContactPhone: "0309-1098765",

    joiningDate: "2020-09-12",
    baseSalary: 62000,

    licenseNumber: "LHR-HTV-11226",
    licenseExpiryDate: "2027-09-30",
    licenseVerificationStatus: "verified",

    status: "assigned",

    assignedTruckId: 6,
    assignedTruckRegistration: "LEF-1122",
  },

  {
    id: 6,
    name: "Saad Mahmood",
    phone: "0310-6789012",
    email: "saad.mahmood@example.com",

    cnic: "35202-6789012-1",
    dateOfBirth: "1994-01-26",
    address: "Lahore, Punjab",

    emergencyContactName: "Tariq Mahmood",
    emergencyContactPhone: "0311-2109876",

    joiningDate: "2024-03-05",
    baseSalary: 55000,

    licenseNumber: "LHR-HTV-55661",
    licenseExpiryDate: "2027-12-10",
    licenseVerificationStatus: "verified",

    status: "available",
  },

  {
    id: 7,
    name: "Hassan Javed",
    phone: "0312-7890123",

    cnic: "35202-7890123-3",
    dateOfBirth: "1991-10-11",
    address: "Gujranwala, Punjab",

    emergencyContactName: "Javed Akram",
    emergencyContactPhone: "0313-3210987",

    joiningDate: "2023-08-21",
    baseSalary: 57000,

    licenseNumber: "GRW-HTV-77883",
    licenseExpiryDate: "2026-09-25",
    licenseVerificationStatus: "expired",

    status: "inactive",

    notes: "Inactive until driving license renewal.",
  },

  {
    id: 8,
    name: "Owais Ahmed",
    phone: "0314-8901234",
    email: "owais.ahmed@example.com",

    cnic: "35202-8901234-5",
    dateOfBirth: "1993-06-18",
    address: "Lahore, Punjab",

    emergencyContactName: "Noman Ahmed",
    emergencyContactPhone: "0315-4321098",

    joiningDate: "2024-06-10",
    baseSalary: 54000,

    licenseNumber: "LHR-HTV-88994",
    licenseExpiryDate: "2027-06-25",
    licenseVerificationStatus: "pending",

    status: "on_leave",

    notes: "Currently on approved leave.",
  },
];