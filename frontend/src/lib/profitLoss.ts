import { companyExpenses } from "@/data/companyExpenses";
import { driverSalaries } from "@/data/driverSalaries";
import { fuelEntries } from "@/data/fuelEntries";
import { maintenanceRecords } from "@/data/maintenanceRecords";
import { tripExpenses } from "@/data/tripExpenses";
import { trips } from "@/data/trips";
import { ProfitLossSummary } from "@/types/profitLoss";

interface ProfitLossDateRange {
  startDate: string;
  endDate: string;
}

export function calculateProfitLoss({
  startDate,
  endDate,
}: ProfitLossDateRange): ProfitLossSummary {
  // -------------------------
  // Income
  // -------------------------

  const tripRevenue = trips
    .filter(
      (trip) =>
        trip.status !== "cancelled" &&
        isDateInRange(
          trip.startDate,
          startDate,
          endDate
        )
    )
    .reduce(
      (total, trip) => total + trip.tripAmount,
      0
    );

  const totalIncome = tripRevenue;

  // -------------------------
  // Fuel Expenses
  // -------------------------

  const fuelExpenses = fuelEntries
    .filter((entry) =>
      isDateInRange(
        entry.fuelDate,
        startDate,
        endDate
      )
    )
   .reduce(
  (total, entry) => total + entry.totalAmount,
  0
);
  // -------------------------
  // Trip Expenses
  // -------------------------

  const tripExpenseTotal = tripExpenses
    .filter((expense) =>
      isDateInRange(
        expense.expenseDate,
        startDate,
        endDate
      )
    )
    .reduce(
      (total, expense) => total + expense.amount,
      0
    );

  // -------------------------
  // Maintenance
  // -------------------------

  const maintenanceExpenses = maintenanceRecords
    .filter((record) =>
      isDateInRange(
        record.serviceDate,
        startDate,
        endDate
      )
    )
    .reduce(
      (total, record) =>
        total +
        record.labourCost +
        record.partsCost +
        record.otherCost,
      0
    );

  // -------------------------
  // Driver Salaries
  // -------------------------

  const driverSalaryExpenses = driverSalaries
    .filter((salary) =>
      salary.salaryMonth >= startDate.slice(0, 7) &&
      salary.salaryMonth <= endDate.slice(0, 7)
    )
    .reduce((total, salary) => {
      const grossSalary =
        salary.basicSalary +
        salary.tripAllowance +
        salary.bonus;

      const netSalary = Math.max(
        0,
        grossSalary - salary.deductions
      );

      return total + netSalary;
    }, 0);

  // -------------------------
  // Company Expenses
  // -------------------------

  const companyExpenseTotal = companyExpenses
    .filter((expense) =>
      isDateInRange(
        expense.expenseDate,
        startDate,
        endDate
      )
    )
    .reduce(
      (total, expense) => total + expense.amount,
      0
    );

  // -------------------------
  // Totals
  // -------------------------

  const totalExpenses =
    fuelExpenses +
    tripExpenseTotal +
    maintenanceExpenses +
    driverSalaryExpenses +
    companyExpenseTotal;

  const netProfit = totalIncome - totalExpenses;

  const profitMarginPercentage =
    totalIncome > 0
      ? (netProfit / totalIncome) * 100
      : 0;

  return {
    income: {
      tripRevenue,
      totalIncome,
    },

    expenses: {
      fuelExpenses,
      tripExpenses: tripExpenseTotal,
      maintenanceExpenses,
      driverSalaries: driverSalaryExpenses,
      companyExpenses: companyExpenseTotal,
      totalExpenses,
    },

    netProfit,
    profitMarginPercentage,
  };
}

function isDateInRange(
  date: string,
  startDate: string,
  endDate: string
) {
  return date >= startDate && date <= endDate;
}