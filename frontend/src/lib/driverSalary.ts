import {
  DriverSalary,
  DriverSalaryPayment,
  DriverSalaryStatus,
} from "@/types/driverSalary";

export interface DriverSalarySummary {
  grossSalary: number;
  netSalary: number;
  paidAmount: number;
  remainingAmount: number;
  status: DriverSalaryStatus;
}

export function calculateDriverSalary(
  salary: DriverSalary,
  payments: DriverSalaryPayment[]
): DriverSalarySummary {
  const basicSalary = Math.max(0, salary.basicSalary);
  const tripAllowance = Math.max(0, salary.tripAllowance);
  const bonus = Math.max(0, salary.bonus);
  const deductions = Math.max(0, salary.deductions);

  const grossSalary =
    basicSalary + tripAllowance + bonus;

  const netSalary = Math.max(
    0,
    grossSalary - deductions
  );

  const paidAmount = payments
    .filter(
      (payment) =>
        payment.driverSalaryId === salary.id
    )
    .reduce(
      (total, payment) =>
        total + Math.max(0, payment.amount),
      0
    );

  const remainingAmount = Math.max(
    0,
    netSalary - paidAmount
  );

  let status: DriverSalaryStatus = "unpaid";

  if (netSalary === 0 || paidAmount >= netSalary) {
    status = "paid";
  } else if (paidAmount > 0) {
    status = "partially_paid";
  }

  return {
    grossSalary,
    netSalary,
    paidAmount,
    remainingAmount,
    status,
  };
}