export type DriverSalaryStatus =
  | "unpaid"
  | "partially_paid"
  | "paid";

export type SalaryPaymentMethod =
  | "cash"
  | "bank_transfer"
  | "jazzcash"
  | "easypaisa"
  | "other";

export interface DriverSalary {
  id: number;

  driverId: number;

  salaryMonth: string;

  basicSalary: number;

  tripAllowance: number;
  bonus: number;

  deductions: number;

  notes?: string;

  createdBy: string;
  createdAt: string;
}

export interface DriverSalaryPayment {
  id: number;

  driverSalaryId: number;

  amount: number;

  paymentDate: string;

  paymentMethod: SalaryPaymentMethod;

  referenceNumber?: string;

  notes?: string;

  createdBy: string;
  createdAt: string;
}