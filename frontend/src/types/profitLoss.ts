export interface ProfitLossIncome {
  tripRevenue: number;
  totalIncome: number;
}

export interface ProfitLossExpenses {
  fuelExpenses: number;
  tripExpenses: number;
  maintenanceExpenses: number;
  driverSalaries: number;
  companyExpenses: number;
  totalExpenses: number;
}

export interface ProfitLossSummary {
  income: ProfitLossIncome;
  expenses: ProfitLossExpenses;

  netProfit: number;
  profitMarginPercentage: number;
}