"use client";

import {
  driverSalaries,
  driverSalaryPayments,
} from "@/data/driverSalaries";
import { drivers } from "@/data/drivers";
import { calculateDriverSalary } from "@/lib/driverSalary";
import { DriverSalaryStatus } from "@/types/driverSalary";
import {
  Banknote,
  CirclePlus,
  Clock3,
  Search,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter = DriverSalaryStatus | "all";

const statusLabels: Record<
  DriverSalaryStatus,
  string
> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  paid: "Paid",
};

const statusClasses: Record<
  DriverSalaryStatus,
  string
> = {
  unpaid: "bg-red-50 text-red-700",
  partially_paid:
    "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
};

export default function DriverSalariesPage() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const salaryRows = useMemo(() => {
    return driverSalaries.map((salary) => {
      const driver = drivers.find(
        (item) =>
          item.id === salary.driverId
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
    });
  }, []);

  const filteredRows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return salaryRows.filter(
      ({ salary, driver, summary }) => {
        const matchesSearch =
          !query ||
          [
            driver?.name,
            driver?.phone,
            salary.salaryMonth,
            formatSalaryMonth(
              salary.salaryMonth
            ),
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesStatus =
          statusFilter === "all" ||
          summary.status === statusFilter;

        return (
          matchesSearch && matchesStatus
        );
      }
    );
  }, [salaryRows, search, statusFilter]);

  const totalPayroll = salaryRows.reduce(
    (total, row) =>
      total + row.summary.netSalary,
    0
  );

  const totalPaid = salaryRows.reduce(
    (total, row) =>
      total + row.summary.paidAmount,
    0
  );

  const totalRemaining = salaryRows.reduce(
    (total, row) =>
      total + row.summary.remainingAmount,
    0
  );

  const pendingSalaryCount =
    salaryRows.filter(
      (row) =>
        row.summary.status !== "paid"
    ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
            Driver Salaries
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage monthly driver salaries,
            deductions and payment balances.
          </p>
        </div>

        <Link
          href="/admin/salaries/add"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-fit"
        >
          <CirclePlus size={17} />
          Create Salary
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Payroll"
          value={formatCurrency(
            totalPayroll
          )}
          subtitle="Net salary payable"
          icon={WalletCards}
        />

        <SummaryCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          subtitle="Payments recorded"
          icon={Banknote}
        />

        <SummaryCard
          title="Outstanding"
          value={formatCurrency(
            totalRemaining
          )}
          subtitle="Remaining salary balance"
          icon={Clock3}
        />

        <SummaryCard
          title="Pending Salaries"
          value={String(
            pendingSalaryCount
          )}
          subtitle="Unpaid or partially paid"
          icon={UserRound}
        />
      </section>

      {/* Salary Records */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Filters */}
        <div className="border-b border-(--border) p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-(--text)">
                Salary Records
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                {filteredRows.length} salary
                record
                {filteredRows.length === 1
                  ? ""
                  : "s"}{" "}
                found.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search driver or month..."
                  className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
                />
              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter
                  )
                }
                className="w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary) sm:w-auto"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="partially_paid">
                  Partially Paid
                </option>

                <option value="unpaid">
                  Unpaid
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Salary Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredRows.map(
            ({
              salary,
              driver,
              summary,
            }) => (
              <div
                key={salary.id}
                className="p-4"
              >
                {/* Driver + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                      <UserRound size={18} />
                    </div>

                    <div className="min-w-0">
                      {driver ? (
                        <>
                          <Link
                            href={`/admin/drivers/${driver.id}`}
                            className="block truncate font-semibold text-(--text) transition hover:text-(--primary)"
                          >
                            {driver.name}
                          </Link>

                          <p className="mt-1 text-xs text-(--text-muted)">
                            {driver.phone}
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-(--text)">
                          Unknown Driver
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                      statusClasses[
                        summary.status
                      ]
                    }`}
                  >
                    {
                      statusLabels[
                        summary.status
                      ]
                    }
                  </span>
                </div>

                {/* Month */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Salary Month
                  </p>

                  <p className="mt-1 text-sm font-semibold text-(--text)">
                    {formatSalaryMonth(
                      salary.salaryMonth
                    )}
                  </p>
                </div>

                {/* Salary Components */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <MobileInfo
                    label="Basic Salary"
                    value={formatCurrency(
                      salary.basicSalary
                    )}
                  />

                  <MobileInfo
                    label="Trip Allowance"
                    value={formatCurrency(
                      salary.tripAllowance
                    )}
                  />

                  <MobileInfo
                    label="Bonus"
                    value={formatCurrency(
                      salary.bonus
                    )}
                  />

                  <MobileInfo
                    label="Deductions"
                    value={formatCurrency(
                      salary.deductions
                    )}
                  />
                </div>

                {/* Financial Summary */}
                <div className="mt-4 overflow-hidden rounded-xl border border-(--border)">
                  <SalaryAmountRow
                    label="Net Salary"
                    value={formatCurrency(
                      summary.netSalary
                    )}
                    strong
                  />

                  <SalaryAmountRow
                    label="Paid"
                    value={formatCurrency(
                      summary.paidAmount
                    )}
                  />

                  <SalaryAmountRow
                    label="Remaining"
                    value={formatCurrency(
                      summary.remainingAmount
                    )}
                    danger={
                      summary.remainingAmount >
                      0
                    }
                    success={
                      summary.remainingAmount ===
                      0
                    }
                    last
                  />
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {driver && (
                    <Link
                      href={`/admin/drivers/${driver.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
                    >
                      View Driver
                    </Link>
                  )}

                  <Link
                    href={`/admin/salaries/${salary.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
                  >
                    View Salary
                  </Link>
                </div>
              </div>
            )
          )}

          {filteredRows.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1350px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Driver</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>
                  Allowance
                </TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>
                  Deductions
                </TableHead>
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
              {filteredRows.map(
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
                      {driver ? (
                        <div>
                          <Link
                            href={`/admin/drivers/${driver.id}`}
                            className="font-semibold text-(--text) transition hover:text-(--primary)"
                          >
                            {driver.name}
                          </Link>

                          <p className="mt-1 text-xs text-(--text-muted)">
                            {driver.phone}
                          </p>
                        </div>
                      ) : (
                        "Unknown Driver"
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-(--text)">
                        {formatSalaryMonth(
                          salary.salaryMonth
                        )}
                      </span>
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
                      <span className="font-semibold text-(--text)">
                        {formatCurrency(
                          summary.netSalary
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        summary.paidAmount
                      )}
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          summary.remainingAmount >
                          0
                            ? "font-semibold text-(--danger)"
                            : "font-semibold text-green-700"
                        }
                      >
                        {formatCurrency(
                          summary.remainingAmount
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusClasses[
                            summary.status
                          ]
                        }`}
                      >
                        {
                          statusLabels[
                            summary.status
                          ]
                        }
                      </span>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/salaries/${salary.id}`}
                        className="text-sm font-semibold text-(--primary) hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </tr>
                )
              )}

              {filteredRows.length ===
                0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No salary records found.
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

function MobileInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-(--text)">
        {value}
      </p>
    </div>
  );
}

function SalaryAmountRow({
  label,
  value,
  strong = false,
  danger = false,
  success = false,
  last = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  danger?: boolean;
  success?: boolean;
  last?: boolean;
}) {
  let valueClass =
    "font-semibold text-(--text)";

  if (danger) {
    valueClass =
      "font-bold text-(--danger)";
  }

  if (success) {
    valueClass =
      "font-bold text-green-700";
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-3 ${
        !last
          ? "border-b border-(--border)"
          : ""
      } ${
        strong ? "bg-slate-50" : "bg-white"
      }`}
    >
      <span className="text-sm text-(--text-muted)">
        {label}
      </span>

      <span
        className={`text-right text-sm ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-10 text-center">
      <WalletCards
        size={28}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm text-(--text-muted)">
        No salary records found.
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Banknote;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted) sm:text-sm">
            {title}
          </p>

          <p className="mt-2 break-words text-lg font-bold text-(--text) sm:text-xl xl:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            {subtitle}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary) sm:h-11 sm:w-11">
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

function formatSalaryMonth(month: string) {
  const [year, monthNumber] =
    month.split("-");

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(
    new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    )
  );
}