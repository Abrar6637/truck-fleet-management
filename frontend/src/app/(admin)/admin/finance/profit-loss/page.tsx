"use client";

import { calculateProfitLoss } from "@/lib/profitLoss";
import {
  exportReportToExcel,
  exportReportToPDF,
} from "@/lib/reportExport";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Download,
FileSpreadsheet,
  Fuel,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function ProfitLossPage() {
  const [startDate, setStartDate] =
    useState("2026-09-01");
  const [endDate, setEndDate] =
    useState("2026-10-31");

  const report = useMemo(
    () =>
      calculateProfitLoss({
        startDate,
        endDate,
      }),
    [startDate, endDate]
  );

  const isProfit = report.netProfit >= 0;

  const expenseBreakdown = [
    {
      label: "Fuel",
      value: report.expenses.fuelExpenses,
      icon: Fuel,
    },
    {
      label: "Trip Expenses",
      value: report.expenses.tripExpenses,
      icon: Truck,
    },
    {
      label: "Maintenance",
      value: report.expenses.maintenanceExpenses,
      icon: Wrench,
    },
    {
      label: "Driver Salaries",
      value: report.expenses.driverSalaries,
      icon: Users,
    },
    {
      label: "Company Expenses",
      value: report.expenses.companyExpenses,
      icon: Building2,
    },
  ];

  const largestExpense = expenseBreakdown.reduce(
    (largest, current) =>
      current.value > largest.value
        ? current
        : largest,
    expenseBreakdown[0]
  );

  const invalidRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    startDate > endDate;

    const exportRows = [
  {
    category: "Income",
    item: "Trip Revenue",
    amount: report.income.tripRevenue,
  },
  {
    category: "Income",
    item: "Total Income",
    amount: report.income.totalIncome,
  },
  {
    category: "Expense",
    item: "Fuel",
    amount: report.expenses.fuelExpenses,
  },
  {
    category: "Expense",
    item: "Trip Expenses",
    amount: report.expenses.tripExpenses,
  },
  {
    category: "Expense",
    item: "Maintenance",
    amount: report.expenses.maintenanceExpenses,
  },
  {
    category: "Expense",
    item: "Driver Salaries",
    amount: report.expenses.driverSalaries,
  },
  {
    category: "Expense",
    item: "Company Expenses",
    amount: report.expenses.companyExpenses,
  },
  {
    category: "Expense",
    item: "Total Expenses",
    amount: report.expenses.totalExpenses,
  },
];

const exportColumns = [
  {
    header: "Category",
    value: (row: (typeof exportRows)[number]) =>
      row.category,
  },
  {
    header: "Item",
    value: (row: (typeof exportRows)[number]) =>
      row.item,
  },
  {
    header: "Amount (PKR)",
    value: (row: (typeof exportRows)[number]) =>
      row.amount,
  },
];

const exportSummary = [
  {
    label: "Period",
    value: `${formatDate(startDate)} - ${formatDate(
      endDate
    )}`,
  },
  {
    label: "Total Revenue",
    value: formatCurrency(report.income.totalIncome),
  },
  {
    label: "Total Expenses",
    value: formatCurrency(
      report.expenses.totalExpenses
    ),
  },
  {
    label: isProfit ? "Net Profit" : "Net Loss",
    value: formatCurrency(
      Math.abs(report.netProfit)
    ),
  },
  {
    label: "Profit Margin",
    value: `${report.profitMarginPercentage.toFixed(
      1
    )}%`,
  },
  {
    label: "Largest Expense",
    value: `${largestExpense.label}: ${formatCurrency(
      largestExpense.value
    )}`,
  },
];

function handlePDFExport() {
  if (invalidRange) {
    return;
  }

  exportReportToPDF({
    title: "Profit & Loss Report",
    fileName: `profit-loss-${startDate}-to-${endDate}`,
    columns: exportColumns,
    rows: exportRows,
    summary: exportSummary,
  });
}

function handleExcelExport() {
  if (invalidRange) {
    return;
  }

  exportReportToExcel({
    title: "Profit & Loss Report",
    fileName: `profit-loss-${startDate}-to-${endDate}`,
    columns: exportColumns,
    rows: exportRows,
    summary: exportSummary,
  });
}

  return (
    <div className="space-y-7">
     {/* Header */}
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div>
    <h2 className="text-2xl font-bold text-(--text)">
      Profit & Loss
    </h2>

    <p className="mt-1 text-sm text-(--text-muted)">
      Review fleet revenue, operating expenses and
      overall profitability.
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
    <button
      type="button"
      onClick={handlePDFExport}
      disabled={invalidRange}
      className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={17} />
      Download PDF
    </button>

    <button
      type="button"
      onClick={handleExcelExport}
      disabled={invalidRange}
      className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FileSpreadsheet size={17} />
      Export Excel
    </button>
  </div>
</div>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h3 className="font-semibold text-(--text)">
              Report Period
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Select the date range for this financial
              report.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <DateField
              label="From"
              value={startDate}
              onChange={setStartDate}
            />

            <DateField
              label="To"
              value={endDate}
              onChange={setEndDate}
            />
          </div>
        </div>

        {invalidRange && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-(--danger)">
            Start date cannot be after end date.
          </div>
        )}
      </section>

      {!invalidRange && (
        <>
          {/* Main Financial Cards */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FinancialCard
              label="Total Revenue"
              value={report.income.totalIncome}
              description="Trip revenue"
              icon={ArrowUpRight}
            />

            <FinancialCard
              label="Total Expenses"
              value={report.expenses.totalExpenses}
              description="Operating expenses"
              icon={ArrowDownRight}
            />

            <FinancialCard
              label={
                isProfit
                  ? "Net Profit"
                  : "Net Loss"
              }
              value={Math.abs(report.netProfit)}
              description={
                isProfit
                  ? "Revenue minus expenses"
                  : "Expenses exceed revenue"
              }
              icon={
                isProfit
                  ? TrendingUp
                  : TrendingDown
              }
            />

            <div className="rounded-2xl border border-(--border) bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-(--text-muted)">
                    Profit Margin
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${
                      isProfit
                        ? "text-green-600"
                        : "text-(--danger)"
                    }`}
                  >
                    {report.profitMarginPercentage.toFixed(
                      1
                    )}
                    %
                  </p>

                  <p className="mt-1 text-xs text-(--text-muted)">
                    Net profit as % of revenue
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                  <Banknote size={20} />
                </div>
              </div>
            </div>
          </section>

          {/* Income / Expense Breakdown */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Income */}
            <section className="rounded-2xl border border-(--border) bg-white">
              <SectionHeader
                title="Income Breakdown"
                description="Revenue generated by fleet operations."
              />

              <div className="p-6">
                <BreakdownRow
                  label="Trip Revenue"
                  value={report.income.tripRevenue}
                  icon={Truck}
                />

                <div className="mt-5 border-t border-(--border) pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-(--text)">
                      Total Income
                    </span>

                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(
                        report.income.totalIncome
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Expenses */}
            <section className="rounded-2xl border border-(--border) bg-white">
              <SectionHeader
                title="Expense Breakdown"
                description="Operating costs included in this report."
              />

              <div className="divide-y divide-(--border) px-6">
                {expenseBreakdown.map((expense) => (
                  <BreakdownRow
                    key={expense.label}
                    label={expense.label}
                    value={expense.value}
                    icon={expense.icon}
                  />
                ))}

                <div className="flex items-center justify-between gap-4 py-5">
                  <span className="font-semibold text-(--text)">
                    Total Expenses
                  </span>

                  <span className="text-lg font-bold text-(--danger)">
                    {formatCurrency(
                      report.expenses.totalExpenses
                    )}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Net Result */}
          <section
            className={`rounded-2xl border p-6 ${
              isProfit
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isProfit
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  Financial Result
                </p>

                <h3
                  className={`mt-2 text-3xl font-bold ${
                    isProfit
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {isProfit
                    ? "Net Profit"
                    : "Net Loss"}
                  :{" "}
                  {formatCurrency(
                    Math.abs(report.netProfit)
                  )}
                </h3>

                <p className="mt-2 text-sm text-(--text-muted)">
                  For {formatDate(startDate)} to{" "}
                  {formatDate(endDate)}
                </p>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isProfit
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isProfit ? (
                  <TrendingUp size={27} />
                ) : (
                  <TrendingDown size={27} />
                )}
              </div>
            </div>
          </section>

          {/* Report Notes */}
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <ReceiptText
                size={20}
                className="mt-0.5 shrink-0 text-(--primary)"
              />

              <div>
                <p className="text-sm font-semibold text-(--text)">
                  How this report is calculated
                </p>

                <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                  Revenue uses non-cancelled trip
                  amounts. Expenses combine fuel, trip
                  expenses, maintenance, driver salaries
                  and company overhead without counting
                  those costs twice.
                </p>

                <p className="mt-2 text-sm text-(--text-muted)">
                  Largest expense in this period:{" "}
                  <span className="font-semibold text-(--text)">
                    {largestExpense.label} —{" "}
                    {formatCurrency(
                      largestExpense.value
                    )}
                  </span>
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function FinancialCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Banknote;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--text-muted)">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-(--text)">
            {formatCurrency(value)}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Banknote;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-(--text-muted)">
          <Icon size={17} />
        </div>

        <span className="text-sm font-medium text-(--text)">
          {label}
        </span>
      </div>

      <span className="text-sm font-semibold text-(--text)">
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-(--border) px-6 py-5">
      <h3 className="font-semibold text-(--text)">
        {title}
      </h3>

      <p className="mt-1 text-sm text-(--text-muted)">
        {description}
      </p>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-semibold text-(--text-muted)">
        {label}
      </span>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)"
      />
    </label>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}