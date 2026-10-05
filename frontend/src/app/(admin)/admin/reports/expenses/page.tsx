"use client";

import { companyExpenses } from "@/data/companyExpenses";
import { tripExpenses } from "@/data/tripExpenses";
import { trips } from "@/data/trips";
import {
    exportReportToExcel,
    exportReportToPDF,
} from "@/lib/reportExport";
import {
    Building2,
    CalendarDays,
    Download,
    FileSpreadsheet,
    ReceiptText,
    Search,
    Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ExpenseSource = "all" | "trip" | "company";

interface ExpenseRow {
    id: string;
    source: "trip" | "company";
    sourceId: number;
    date: string;
    category: string;
    title: string;
    description?: string;
    amount: number;
    tripId?: number;
    reference?: string;
}

export default function ExpenseReportPage() {
    const [search, setSearch] = useState("");
    const [sourceFilter, setSourceFilter] =
        useState<ExpenseSource>("all");

    const [startDate, setStartDate] =
        useState("2026-09-01");

    const [endDate, setEndDate] =
        useState("2026-10-31");

    const invalidRange =
        Boolean(startDate) &&
        Boolean(endDate) &&
        startDate > endDate;

    const allExpenses = useMemo<ExpenseRow[]>(() => {
        const tripRows: ExpenseRow[] = tripExpenses.map(
            (expense) => {
                const trip = trips.find(
                    (item) => item.id === expense.tripId
                );

                return {
                    id: `trip-${expense.id}`,
                    source: "trip",
                    sourceId: expense.id,
                    date: expense.expenseDate,
                    category: expense.category,
                    title: trip
                        ? `${trip.tripNumber} • ${formatText(
                            expense.category
                        )}`
                        : formatText(expense.category),
                    description: expense.description,
                    amount: expense.amount,
                    tripId: expense.tripId,
                    reference: expense.receiptNumber,
                };
            }
        );

        const companyRows: ExpenseRow[] =
            companyExpenses.map((expense) => ({
                id: `company-${expense.id}`,
                source: "company",
                sourceId: expense.id,
                date: expense.expenseDate,
                category: expense.category,
                title: expense.title,
                description: expense.description,
                amount: expense.amount,
                reference:
                    expense.referenceNumber ??
                    expense.receiptFileName,
            }));

        return [...tripRows, ...companyRows];
    }, []);

    const filteredExpenses = useMemo(() => {
        if (invalidRange) {
            return [];
        }

        const query = search.trim().toLowerCase();

        return allExpenses
            .filter((expense) => {
                const matchesSource =
                    sourceFilter === "all" ||
                    expense.source === sourceFilter;

                const matchesStart =
                    !startDate || expense.date >= startDate;

                const matchesEnd =
                    !endDate || expense.date <= endDate;

                const matchesSearch =
                    !query ||
                    [
                        expense.title,
                        expense.category,
                        expense.description,
                        expense.reference,
                    ]
                        .filter(Boolean)
                        .some((value) =>
                            String(value)
                                .toLowerCase()
                                .includes(query)
                        );

                return (
                    matchesSource &&
                    matchesStart &&
                    matchesEnd &&
                    matchesSearch
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
            );
    }, [
        allExpenses,
        search,
        sourceFilter,
        startDate,
        endDate,
        invalidRange,
    ]);

    const tripExpenseTotal = filteredExpenses
        .filter((expense) => expense.source === "trip")
        .reduce(
            (total, expense) => total + expense.amount,
            0
        );

    const companyExpenseTotal = filteredExpenses
        .filter(
            (expense) => expense.source === "company"
        )
        .reduce(
            (total, expense) => total + expense.amount,
            0
        );

    const totalExpenses =
        tripExpenseTotal + companyExpenseTotal;

    const exportColumns = [
        {
            header: "Date",
            value: (expense: ExpenseRow) =>
                formatDate(expense.date),
        },
        {
            header: "Source",
            value: (expense: ExpenseRow) =>
                expense.source === "trip"
                    ? "Trip Expense"
                    : "Company Expense",
        },
        {
            header: "Expense",
            value: (expense: ExpenseRow) =>
                expense.title,
        },
        {
            header: "Category",
            value: (expense: ExpenseRow) =>
                formatText(expense.category),
        },
        {
            header: "Description",
            value: (expense: ExpenseRow) =>
                expense.description ?? "—",
        },
        {
            header: "Reference",
            value: (expense: ExpenseRow) =>
                expense.reference ?? "—",
        },
        {
            header: "Amount (PKR)",
            value: (expense: ExpenseRow) =>
                expense.amount,
        },
    ];

    const exportSummary = [
        {
            label: "Total Expenses",
            value: formatCurrency(totalExpenses),
        },
        {
            label: "Trip Expenses",
            value: formatCurrency(tripExpenseTotal),
        },
        {
            label: "Company Expenses",
            value: formatCurrency(companyExpenseTotal),
        },
        {
            label: "Records",
            value: filteredExpenses.length,
        },
    ];

    function handlePDFExport() {
        exportReportToPDF({
            title: "Expense Report",
            fileName: "expense-report",
            columns: exportColumns,
            rows: filteredExpenses,
            summary: exportSummary,
        });
    }

    function handleExcelExport() {
        exportReportToExcel({
            title: "Expense Report",
            fileName: "expense-report",
            columns: exportColumns,
            rows: filteredExpenses,
            summary: exportSummary,
        });
    }

    return (
        <div className="space-y-7">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-(--text)">
                        Expense Report
                    </h2>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        Review trip operating expenses and company
                        overhead expenses in one report.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handlePDFExport}
                        disabled={filteredExpenses.length === 0}
                        className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download size={17} />
                        Download PDF
                    </button>

                    <button
                        type="button"
                        onClick={handleExcelExport}
                        disabled={filteredExpenses.length === 0}
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
                    <div>
                        <label className={labelClass}>
                            Search
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
                                placeholder="Expense, category, reference..."
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Expense Source
                        </label>

                        <select
                            value={sourceFilter}
                            onChange={(event) =>
                                setSourceFilter(
                                    event.target.value as ExpenseSource
                                )
                            }
                            className={inputClass}
                        >
                            <option value="all">
                                All Expenses
                            </option>

                            <option value="trip">
                                Trip Expenses
                            </option>

                            <option value="company">
                                Company Expenses
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>
                            From
                        </label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(event) =>
                                setStartDate(event.target.value)
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            To
                        </label>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) =>
                                setEndDate(event.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                </div>

                {invalidRange && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-(--danger)">
                        Start date cannot be after end date.
                    </div>
                )}
            </section>

            {/* Summary */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Total Expenses"
                    value={formatCurrency(totalExpenses)}
                    subtitle={`${filteredExpenses.length} expense records`}
                    icon={ReceiptText}
                />

                <SummaryCard
                    label="Trip Expenses"
                    value={formatCurrency(tripExpenseTotal)}
                    subtitle="Trip operating expenses"
                    icon={Truck}
                />

                <SummaryCard
                    label="Company Expenses"
                    value={formatCurrency(companyExpenseTotal)}
                    subtitle="Fleet/company overhead"
                    icon={Building2}
                />

                <SummaryCard
                    label="Records"
                    value={String(filteredExpenses.length)}
                    subtitle="Within selected period"
                    icon={CalendarDays}
                />
            </section>

            {/* Information */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-medium text-(--text)">
                    This report includes trip expenses and company
                    overhead only.
                </p>

                <p className="mt-1 text-sm text-(--text-muted)">
                    Fuel, maintenance and driver salaries are kept
                    separate to avoid duplicate expense reporting.
                </p>
            </section>

            {/* Table */}
            <section className="rounded-2xl border border-(--border) bg-white">
                <div className="border-b border-(--border) px-5 py-4">
                    <h3 className="font-semibold text-(--text)">
                        Expense Records
                    </h3>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        {filteredExpenses.length} record
                        {filteredExpenses.length === 1
                            ? ""
                            : "s"}{" "}
                        found.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px]">
                        <thead>
                            <tr className="border-b border-(--border) bg-slate-50">
                                <TableHead>Date</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Expense</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
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
                                        {formatDate(expense.date)}
                                    </TableCell>

                                    <TableCell>
                                        <SourceBadge
                                            source={expense.source}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <p className="font-semibold text-(--text)">
                                            {expense.title}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        {formatText(expense.category)}
                                    </TableCell>

                                    <TableCell>
                                        <span className="block max-w-[240px] truncate">
                                            {expense.description ?? "—"}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {expense.reference ?? "—"}
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-semibold text-(--text)">
                                            {formatCurrency(
                                                expense.amount
                                            )}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {expense.source === "trip" &&
                                            expense.tripId ? (
                                            <Link
                                                href={`/admin/trips/${expense.tripId}`}
                                                className="text-sm font-semibold text-(--primary) hover:underline"
                                            >
                                                View Trip
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/admin/finance/expenses/${expense.sourceId}`}
                                                className="text-sm font-semibold text-(--primary) hover:underline"
                                            >
                                                View Expense
                                            </Link>
                                        )}
                                    </TableCell>
                                </tr>
                            ))}

                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-12 text-center text-sm text-(--text-muted)"
                                    >
                                        No expense records found for the
                                        selected filters.
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

function SourceBadge({
    source,
}: {
    source: "trip" | "company";
}) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${source === "trip"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-violet-50 text-violet-700"
                }`}
        >
            {source === "trip"
                ? "Trip Expense"
                : "Company Expense"}
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
    icon: typeof ReceiptText;
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

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(
        new Date(`${value}T00:00:00`)
    );
}

function formatText(value: string) {
    return value
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

const labelClass =
    "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
    "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";