import {
  DriverSalary,
  DriverSalaryPayment,
} from "@/types/driverSalary";

export const driverSalaries: DriverSalary[] = [
  {
    id: 1,
    driverId: 1,
    salaryMonth: "2026-09",
    basicSalary: 55000,
    tripAllowance: 12000,
    bonus: 3000,
    deductions: 0,
    notes: "September salary.",
    createdBy: "Fleet Admin",
    createdAt: "2026-09-30T10:00:00",
  },
  {
    id: 2,
    driverId: 2,
    salaryMonth: "2026-09",
    basicSalary: 52000,
    tripAllowance: 9000,
    bonus: 0,
    deductions: 2000,
    notes: "PKR 2,000 deduction.",
    createdBy: "Fleet Admin",
    createdAt: "2026-09-30T10:10:00",
  },
  {
    id: 3,
    driverId: 3,
    salaryMonth: "2026-09",
    basicSalary: 55000,
    tripAllowance: 11000,
    bonus: 2000,
    deductions: 0,
    createdBy: "Fleet Admin",
    createdAt: "2026-09-30T10:20:00",
  },
  {
    id: 4,
    driverId: 4,
    salaryMonth: "2026-09",
    basicSalary: 50000,
    tripAllowance: 7000,
    bonus: 0,
    deductions: 1000,
    createdBy: "Fleet Admin",
    createdAt: "2026-09-30T10:30:00",
  },
  {
    id: 5,
    driverId: 5,
    salaryMonth: "2026-09",
    basicSalary: 52000,
    tripAllowance: 6000,
    bonus: 0,
    deductions: 0,
    createdBy: "Fleet Admin",
    createdAt: "2026-09-30T10:40:00",
  },
  {
    id: 6,
    driverId: 6,
    salaryMonth: "2026-09",
    basicSalary: 48000,
    tripAllowance: 0,
    bonus: 0,
    deductions: 0,
    notes: "No trip allowance for September.",
    createdBy: "Fleet Admin",
    createdAt: "2026-09-30T10:50:00",
  },
];

export const driverSalaryPayments: DriverSalaryPayment[] = [
  // Ahmed Khan — fully paid
  {
    id: 1,
    driverSalaryId: 1,
    amount: 40000,
    paymentDate: "2026-10-01",
    paymentMethod: "bank_transfer",
    referenceNumber: "SAL-AK-001",
    notes: "First salary payment.",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-01T11:00:00",
  },
  {
    id: 2,
    driverSalaryId: 1,
    amount: 30000,
    paymentDate: "2026-10-03",
    paymentMethod: "bank_transfer",
    referenceNumber: "SAL-AK-002",
    notes: "Final salary payment.",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-03T11:00:00",
  },

  // Usman Ali — partially paid
  {
    id: 3,
    driverSalaryId: 2,
    amount: 30000,
    paymentDate: "2026-10-02",
    paymentMethod: "jazzcash",
    referenceNumber: "SAL-UA-001",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-02T12:00:00",
  },

  // Bilal Ahmad — fully paid
  {
    id: 4,
    driverSalaryId: 3,
    amount: 68000,
    paymentDate: "2026-10-02",
    paymentMethod: "bank_transfer",
    referenceNumber: "SAL-BA-001",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-02T13:00:00",
  },

  // Hamza Iqbal — partially paid
  {
    id: 5,
    driverSalaryId: 4,
    amount: 25000,
    paymentDate: "2026-10-03",
    paymentMethod: "cash",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-03T10:00:00",
  },

  // Ali Raza — fully paid
  {
    id: 6,
    driverSalaryId: 5,
    amount: 58000,
    paymentDate: "2026-10-04",
    paymentMethod: "easypaisa",
    referenceNumber: "SAL-AR-001",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-04T09:00:00",
  },

  // Saad Mahmood intentionally has no payment
  // so we can test the "Unpaid" status.
];