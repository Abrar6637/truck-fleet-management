"use client";

import { companyExpenses } from "@/data/companyExpenses";
import { CompanyExpenseCategory } from "@/types/companyExpense";
import {
  Banknote,
  Building2,
  CalendarDays,
  CirclePlus,
  ReceiptText,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type CategoryFilter = CompanyExpenseCategory | "all";

const categoryLabels: Record<CompanyExpenseCategory, string> = {
  office_rent: "Office Rent",
  office_utility: "Office Utility",
  staff_salary: "Staff Salary",
  insurance: "Insurance",
  tax: "Tax",
  software: "Software",
  legal: "Legal",
  marketing: "Marketing",
  bank_charge: "Bank Charge",
  miscellaneous: "Miscellaneous",
};

export default function CompanyExpensesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("all");
  const [monthFilter, setMonthFilter] = useState("");

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companyExpenses
      .filter((expense) => {
        const matchesSearch =
          !query ||
          [
            expense.title,
            expense.vendorName,
            expense.referenceNumber,
            expense.description,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(query)
            );

        const matchesCategory =
          categoryFilter === "all" ||
          expense.category === categoryFilter;

        const matchesMonth =
          !monthFilter ||
          expense.expenseDate.startsWith(monthFilter);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesMonth
        );
      })
      .sort(
        (a, b) =>
          new Date(b.expenseDate).getTime() -
          new Date(a.expenseDate).getTime()
      );
  }, [search, categoryFilter, monthFilter]);

  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const thisMonthExpenses = companyExpenses
    .filter((expense) =>
      expense.expenseDate.startsWith("2026-10")
    )
    .reduce(
      (total, expense) => total + expense.amount,
      0
    );

  const uniqueCategories = new Set(
    filteredExpenses.map((expense) => expense.category)
  ).size;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-(--text)">
            Company Expenses
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage fleet business overhead and company-level
            operating expenses.
          </p>
        </div>

        <Link
          href="/admin/finance/expenses/add"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
        >
          <CirclePlus size={17} />
          Add Expense
        </Link>
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="October Overhead"
          value={formatCurrency(thisMonthExpenses)}
          subtitle="October 2026 company expenses"
          icon={Banknote}
        />

        <SummaryCard
          title="Filtered Total"
          value={formatCurrency(totalExpenses)}
          subtitle="Total for current filters"
          icon={ReceiptText}
        />

        <SummaryCard
          title="Records"
          value={String(filteredExpenses.length)}
          subtitle="Expense records found"
          icon={CalendarDays}
        />

        <SummaryCard
          title="Categories"
          value={String(uniqueCategories)}
          subtitle="Categories in current results"
          icon={Building2}
        />
      </section>

      {/* Important Note */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-semibold text-(--text)">
          Company overhead only
        </p>

        <p className="mt-1 text-sm leading-6 text-(--text-muted)">
          Fuel, trip expenses, truck maintenance and driver
          salaries are managed in their own modules and should
          not be entered here again.
        </p>
      </section>

      {/* Expense Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) p-5">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h3 className="font-semibold text-(--text)">
                Expense Records
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                {filteredExpenses.length} record
                {filteredExpenses.length === 1 ? "" : "s"} found.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              {/* Search */}
              <div className="relative md:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search expenses..."
                  className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
                />
              </div>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value as CategoryFilter
                  )
                }
                className="rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)"
              >
                <option value="all">
                  All Categories
                </option>

                {Object.entries(categoryLabels).map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              {/* Month */}
              <input
                type="month"
                value={monthFilter}
                onChange={(event) =>
                  setMonthFilter(event.target.value)
                }
                className="rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Date</TableHead>
                <TableHead>Expense</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                >
                  <TableCell>
                    {formatDate(expense.expenseDate)}
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="font-semibold text-(--text)">
                        {expense.title}
                      </p>

                      {expense.description && (
                        <p className="mt-1 max-w-64 truncate text-xs text-(--text-muted)">
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-(--primary)">
                      {categoryLabels[expense.category]}
                    </span>
                  </TableCell>

                  <TableCell>
                    {expense.vendorName ?? "—"}
                  </TableCell>

                  <TableCell>
                    {formatPaymentMethod(
                      expense.paymentMethod
                    )}
                  </TableCell>

                  <TableCell>
                    {expense.referenceNumber ?? "—"}
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-(--text)">
                      {formatCurrency(expense.amount)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/admin/finance/expenses/${expense.id}`}
                      className="text-sm font-semibold text-(--primary) hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No company expenses found.
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
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--text-muted)">
            {title}
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatPaymentMethod(method: string) {
  return method
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}