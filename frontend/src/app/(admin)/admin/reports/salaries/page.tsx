"use client";

import { drivers } from "@/data/drivers";
import {
  driverSalaries,
  driverSalaryPayments,
} from "@/data/driverSalaries";
import { calculateDriverSalary } from "@/lib/driverSalary";
import {
  exportReportToExcel,
  exportReportToPDF,
} from "@/lib/reportExport";
import { DriverSalaryStatus } from "@/types/driverSalary";
import {
  Banknote,
  CircleDollarSign,
  Download,
  FileSpreadsheet,
  Search,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter = "all" | DriverSalaryStatus;

export default function SalaryReportPage() {
  const [search, setSearch] = useState("");

  const [driverFilter, setDriverFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [monthFilter, setMonthFilter] =
    useState("all");

  const availableMonths = useMemo(() => {
    return Array.from(
      new Set(
        driverSalaries.map(
          (salary) => salary.salaryMonth
        )
      )
    ).sort((a, b) => b.localeCompare(a));
  }, []);

  const reportRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return driverSalaries
      .map((salary) => {
        const driver = drivers.find(
          (item) => item.id === salary.driverId
        );

        const summary = calculateDriverSalary(
          salary,
          driverSalaryPayments
        );

        return {
          salary,
          driver,
          summary,
        };
      })
      .filter(({ salary, driver, summary }) => {
        const matchesSearch =
          !query ||
          [
            driver?.name,
            driver?.phone,
            driver?.cnic,
            salary.salaryMonth,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesDriver =
          driverFilter === "all" ||
          salary.driverId === Number(driverFilter);

        const matchesStatus =
          statusFilter === "all" ||
          summary.status === statusFilter;

        const matchesMonth =
          monthFilter === "all" ||
          salary.salaryMonth === monthFilter;

        return (
          matchesSearch &&
          matchesDriver &&
          matchesStatus &&
          matchesMonth
        );
      })
      .sort((a, b) =>
        b.salary.salaryMonth.localeCompare(
          a.salary.salaryMonth
        )
      );
  }, [
    search,
    driverFilter,
    statusFilter,
    monthFilter,
  ]);

  const totalNetSalary = reportRows.reduce(
    (total, row) =>
      total + row.summary.netSalary,
    0
  );

  const totalPaid = reportRows.reduce(
    (total, row) =>
      total + row.summary.paidAmount,
    0
  );

  const totalRemaining = reportRows.reduce(
    (total, row) =>
      total + row.summary.remainingAmount,
    0
  );

  const uniqueDrivers = new Set(
    reportRows.map(
      (row) => row.salary.driverId
    )
  ).size;

  const selectedDriver =
    driverFilter === "all"
      ? undefined
      : drivers.find(
          (driver) =>
            driver.id === Number(driverFilter)
        );

  const exportColumns = [
    {
      header: "Month",
      value: (row: (typeof reportRows)[number]) =>
        formatMonth(row.salary.salaryMonth),
    },
    {
      header: "Driver",
      value: (row: (typeof reportRows)[number]) =>
        row.driver?.name ??
        `Driver #${row.salary.driverId}`,
    },
    {
      header: "Phone",
      value: (row: (typeof reportRows)[number]) =>
        row.driver?.phone ?? "—",
    },
    {
      header: "CNIC",
      value: (row: (typeof reportRows)[number]) =>
        row.driver?.cnic ?? "—",
    },
    {
      header: "Basic Salary (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.salary.basicSalary,
    },
    {
      header: "Trip Allowance (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.salary.tripAllowance,
    },
    {
      header: "Bonus (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.salary.bonus,
    },
    {
      header: "Deductions (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.salary.deductions,
    },
    {
      header: "Gross Salary (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.summary.grossSalary,
    },
    {
      header: "Net Salary (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.summary.netSalary,
    },
    {
      header: "Paid (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.summary.paidAmount,
    },
    {
      header: "Remaining (PKR)",
      value: (row: (typeof reportRows)[number]) =>
        row.summary.remainingAmount,
    },
    {
      header: "Payment Status",
      value: (row: (typeof reportRows)[number]) =>
        formatStatus(row.summary.status),
    },
  ];

  const exportSummary = [
    {
      label: "Driver",
      value: selectedDriver
        ? selectedDriver.name
        : "All Drivers",
    },
    {
      label: "Salary Month",
      value:
        monthFilter === "all"
          ? "All Months"
          : formatMonth(monthFilter),
    },
    {
      label: "Net Salaries",
      value: formatCurrency(totalNetSalary),
    },
    {
      label: "Paid",
      value: formatCurrency(totalPaid),
    },
    {
      label: "Remaining",
      value: formatCurrency(totalRemaining),
    },
    {
      label: "Drivers",
      value: uniqueDrivers,
    },
  ];

  function handlePDFExport() {
    if (reportRows.length === 0) return;

    exportReportToPDF({
      title: selectedDriver
        ? `${selectedDriver.name} - Driver Salary Report`
        : "Driver Salary Report",
      fileName: buildExportFileName(
        selectedDriver?.name,
        monthFilter
      ),
      columns: exportColumns,
      rows: reportRows,
      summary: exportSummary,
    });
  }

  function handleExcelExport() {
    if (reportRows.length === 0) return;

    exportReportToExcel({
      title: selectedDriver
        ? `${selectedDriver.name} - Driver Salary Report`
        : "Driver Salary Report",
      fileName: buildExportFileName(
        selectedDriver?.name,
        monthFilter
      ),
      columns: exportColumns,
      rows: reportRows,
      summary: exportSummary,
    });
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-(--text)">
            Driver Salary Report
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Review driver salaries, allowances,
            deductions, payments and outstanding
            balances.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePDFExport}
            disabled={reportRows.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Download PDF
          </button>

          <button
            type="button"
            onClick={handleExcelExport}
            disabled={reportRows.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={17} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div>
            <label className={labelClass}>
              Search Driver
            </label>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Name, phone, CNIC..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Driver */}
          <div>
            <label className={labelClass}>
              Driver
            </label>

            <select
              value={driverFilter}
              onChange={(event) =>
                setDriverFilter(
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Drivers
              </option>

              {drivers
                .slice()
                .sort((a, b) =>
                  a.name.localeCompare(b.name)
                )
                .map((driver) => (
                  <option
                    key={driver.id}
                    value={String(driver.id)}
                  >
                    {driver.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className={labelClass}>
              Salary Month
            </label>

            <select
              value={monthFilter}
              onChange={(event) =>
                setMonthFilter(
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Months
              </option>

              {availableMonths.map((month) => (
                <option
                  key={month}
                  value={month}
                >
                  {formatMonth(month)}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className={labelClass}>
              Payment Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Statuses
              </option>

              <option value="unpaid">
                Unpaid
              </option>

              <option value="partially_paid">
                Partially Paid
              </option>

              <option value="paid">
                Paid
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Net Salaries"
          value={formatCurrency(
            totalNetSalary
          )}
          subtitle={`${reportRows.length} salary records`}
          icon={CircleDollarSign}
        />

        <SummaryCard
          label="Paid"
          value={formatCurrency(totalPaid)}
          subtitle="Salary payments made"
          icon={Banknote}
        />

        <SummaryCard
          label="Remaining"
          value={formatCurrency(
            totalRemaining
          )}
          subtitle="Outstanding salary"
          icon={WalletCards}
        />

        <SummaryCard
          label="Drivers"
          value={String(uniqueDrivers)}
          subtitle="Drivers in report"
          icon={Users}
        />
      </section>

      {/* Information */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-medium text-(--text)">
          Salary totals are calculated automatically.
        </p>

        <p className="mt-1 text-sm text-(--text-muted)">
          Gross Salary = Basic Salary + Trip
          Allowance + Bonus. Net Salary = Gross
          Salary - Deductions. Paid and remaining
          amounts are derived from salary payment
          records.
        </p>
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-5 py-4">
          <h3 className="font-semibold text-(--text)">
            Salary Records
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {reportRows.length} record
            {reportRows.length === 1
              ? ""
              : "s"}{" "}
            found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1450px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Month</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>
                  Trip Allowance
                </TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>
                  Deductions
                </TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>
                  Net Salary
                </TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>
                  Remaining
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {reportRows.map(
                ({
                  salary,
                  driver,
                  summary,
                }) => (
                  <tr
                    key={salary.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <span className="font-medium text-(--text)">
                        {formatMonth(
                          salary.salaryMonth
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      {driver ? (
                        <Link
                          href={`/admin/drivers/${driver.id}`}
                          className="font-semibold text-(--primary) hover:underline"
                        >
                          {driver.name}
                        </Link>
                      ) : (
                        `Driver #${salary.driverId}`
                      )}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        salary.basicSalary
                      )}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        salary.tripAllowance
                      )}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        salary.bonus
                      )}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        salary.deductions
                      )}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        summary.grossSalary
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-(--text)">
                        {formatCurrency(
                          summary.netSalary
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-green-700">
                        {formatCurrency(
                          summary.paidAmount
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          summary.remainingAmount >
                          0
                            ? "font-semibold text-amber-700"
                            : "font-semibold text-green-700"
                        }
                      >
                        {formatCurrency(
                          summary.remainingAmount
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={summary.status}
                      />
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/salaries/${salary.id}`}
                        className="text-sm font-semibold text-(--primary) hover:underline"
                      >
                        View Salary
                      </Link>
                    </TableCell>
                  </tr>
                )
              )}

              {reportRows.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No salary records found for
                    the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: DriverSalaryStatus;
}) {
  const styles = {
    unpaid: "bg-red-50 text-red-700",
    partially_paid:
      "bg-amber-50 text-amber-700",
    paid: "bg-green-50 text-green-700",
  };

  const labels = {
    unpaid: "Unpaid",
    partially_paid: "Partially Paid",
    paid: "Paid",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: typeof Banknote;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-(--text-muted)">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-(--text)">
            {value}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
      {children}
    </th>
  );
}

function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-5 py-4 text-sm text-(--text-muted)">
      {children}
    </td>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(value: string) {
  const normalizedValue =
    value.length === 7
      ? `${value}-01`
      : value;

  const date = new Date(
    `${normalizedValue}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatStatus(
  status: DriverSalaryStatus
) {
  const labels: Record<
    DriverSalaryStatus,
    string
  > = {
    unpaid: "Unpaid",
    partially_paid: "Partially Paid",
    paid: "Paid",
  };

  return labels[status];
}

function buildExportFileName(
  driverName: string | undefined,
  month: string
) {
  const driverPart = driverName
    ? driverName
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase()
    : "all-drivers";

  const monthPart =
    month === "all"
      ? "all-months"
      : month;

  return `driver-salary-${driverPart}-${monthPart}`;
}

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";