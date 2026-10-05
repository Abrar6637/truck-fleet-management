"use client";

import { tripPayments } from "@/data/tripPayments";
import { trips } from "@/data/trips";
import { calculateTripPayment } from "@/lib/tripPayment";
import {
    exportReportToExcel,
    exportReportToPDF,
} from "@/lib/reportExport";
import {
    Banknote,
    CircleDollarSign,
    Percent,
    Download,
    FileSpreadsheet,
    Search,
    WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type PaymentStatus =
    | "all"
    | "unpaid"
    | "partially_paid"
    | "paid";

const paymentStatusOptions: {
    value: PaymentStatus;
    label: string;
}[] = [
        { value: "all", label: "All Payment Statuses" },
        { value: "unpaid", label: "Unpaid" },
        {
            value: "partially_paid",
            label: "Partially Paid",
        },
        { value: "paid", label: "Paid" },
    ];

export default function IncomeReportPage() {
    const [search, setSearch] = useState("");
    const [paymentStatus, setPaymentStatus] =
        useState<PaymentStatus>("all");

    const [startDate, setStartDate] =
        useState("2026-09-01");

    const [endDate, setEndDate] =
        useState("2026-10-31");

    const invalidRange =
        Boolean(startDate) &&
        Boolean(endDate) &&
        startDate > endDate;

    const reportRows = useMemo(() => {
        if (invalidRange) {
            return [];
        }

        const query = search.trim().toLowerCase();

        return trips
            .filter(
                (trip) => trip.status !== "cancelled"
            )
            .map((trip) => {
                const paymentSummary =
                    calculateTripPayment(
                        trip.id,
                        trip.tripAmount,
                        tripPayments
                    );

                return {
                    trip,
                    paymentSummary,
                };
            })
            .filter(({ trip, paymentSummary }) => {
                const matchesSearch =
                    !query ||
                    [
                        trip.tripNumber,
                        trip.origin,
                        trip.destination,
                        trip.pickupCompanyName,
                        trip.deliveryCompanyName,
                    ]
                        .filter(Boolean)
                        .some((value) =>
                            String(value)
                                .toLowerCase()
                                .includes(query)
                        );

                const matchesPaymentStatus =
                    paymentStatus === "all" ||
                    paymentSummary.paymentStatus ===
                    paymentStatus;

                const matchesStart =
                    !startDate ||
                    trip.startDate >= startDate;

                const matchesEnd =
                    !endDate ||
                    trip.startDate <= endDate;

                return (
                    matchesSearch &&
                    matchesPaymentStatus &&
                    matchesStart &&
                    matchesEnd
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.trip.startDate).getTime() -
                    new Date(a.trip.startDate).getTime()
            );
    }, [
        search,
        paymentStatus,
        startDate,
        endDate,
        invalidRange,
    ]);

    const totalRevenue = reportRows.reduce(
        (total, row) =>
            total + row.paymentSummary.tripAmount,
        0
    );

    const totalReceived = reportRows.reduce(
        (total, row) =>
            total + row.paymentSummary.paidAmount,
        0
    );

    const totalOutstanding = reportRows.reduce(
        (total, row) =>
            total +
            row.paymentSummary.remainingAmount,
        0
    );

    const collectionRate =
        totalRevenue > 0
            ? (totalReceived / totalRevenue) * 100
            : 0;

    const exportColumns = [
        {
            header: "Date",
            value: (row: (typeof reportRows)[number]) =>
                formatDate(row.trip.startDate),
        },
        {
            header: "Trip",
            value: (row: (typeof reportRows)[number]) =>
                row.trip.tripNumber,
        },
        {
            header: "Origin",
            value: (row: (typeof reportRows)[number]) =>
                row.trip.origin,
        },
        {
            header: "Destination",
            value: (row: (typeof reportRows)[number]) =>
                row.trip.destination,
        },
        {
            header: "Pickup Company",
            value: (row: (typeof reportRows)[number]) =>
                row.trip.pickupCompanyName,
        },
        {
            header: "Delivery Company",
            value: (row: (typeof reportRows)[number]) =>
                row.trip.deliveryCompanyName,
        },
        {
            header: "Trip Status",
            value: (row: (typeof reportRows)[number]) =>
                formatText(row.trip.status),
        },
        {
            header: "Revenue (PKR)",
            value: (row: (typeof reportRows)[number]) =>
                row.paymentSummary.tripAmount,
        },
        {
            header: "Received (PKR)",
            value: (row: (typeof reportRows)[number]) =>
                row.paymentSummary.paidAmount,
        },
        {
            header: "Outstanding (PKR)",
            value: (row: (typeof reportRows)[number]) =>
                row.paymentSummary.remainingAmount,
        },
        {
            header: "Payment Status",
            value: (row: (typeof reportRows)[number]) =>
                formatText(row.paymentSummary.paymentStatus),
        },
    ];

    const exportSummary = [
        {
            label: "Trip Revenue",
            value: formatCurrency(totalRevenue),
        },
        {
            label: "Received",
            value: formatCurrency(totalReceived),
        },
        {
            label: "Outstanding",
            value: formatCurrency(totalOutstanding),
        },
        {
            label: "Collection Rate",
            value: `${collectionRate.toFixed(1)}%`,
        },
    ];

    function handlePDFExport() {
        exportReportToPDF({
            title: "Income Report",
            fileName: "income-report",
            columns: exportColumns,
            rows: reportRows,
            summary: exportSummary,
        });
    }

    function handleExcelExport() {
        exportReportToExcel({
            title: "Income Report",
            fileName: "income-report",
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
                        Income Report
                    </h2>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        Analyze trip revenue, received payments,
                        outstanding balances and collection performance.
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
                                placeholder="Trip, route, company..."
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Payment Status
                        </label>

                        <select
                            value={paymentStatus}
                            onChange={(event) =>
                                setPaymentStatus(
                                    event.target
                                        .value as PaymentStatus
                                )
                            }
                            className={inputClass}
                        >
                            {paymentStatusOptions.map(
                                (status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                )
                            )}
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
                    label="Trip Revenue"
                    value={formatCurrency(totalRevenue)}
                    subtitle="Agreed trip revenue"
                    icon={CircleDollarSign}
                />

                <SummaryCard
                    label="Received"
                    value={formatCurrency(totalReceived)}
                    subtitle="Payments collected"
                    icon={Banknote}
                />

                <SummaryCard
                    label="Outstanding"
                    value={formatCurrency(
                        totalOutstanding
                    )}
                    subtitle="Pending collection"
                    icon={WalletCards}
                />

                <SummaryCard
                    label="Collection Rate"
                    value={`${collectionRate.toFixed(1)}%`}
                    subtitle="Received vs trip revenue"
                    icon={Percent}
                />
            </section>

            {/* Information */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-medium text-(--text)">
                    Revenue and cash collection are shown separately.
                </p>

                <p className="mt-1 text-sm text-(--text-muted)">
                    Trip Revenue represents the agreed amount of
                    non-cancelled trips. Received represents actual
                    payments recorded against those trips.
                </p>
            </section>

            {/* Table */}
            <section className="rounded-2xl border border-(--border) bg-white">
                <div className="border-b border-(--border) px-5 py-4">
                    <h3 className="font-semibold text-(--text)">
                        Trip Income Records
                    </h3>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        {reportRows.length} trip
                        {reportRows.length === 1 ? "" : "s"}{" "}
                        found.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1250px]">
                        <thead>
                            <tr className="border-b border-(--border) bg-slate-50">
                                <TableHead>Date</TableHead>
                                <TableHead>Trip</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Received</TableHead>
                                <TableHead>Outstanding</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Action</TableHead>
                            </tr>
                        </thead>

                        <tbody>
                            {reportRows.map(
                                ({ trip, paymentSummary }) => (
                                    <tr
                                        key={trip.id}
                                        className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                                    >
                                        <TableCell>
                                            {formatDate(trip.startDate)}
                                        </TableCell>

                                        <TableCell>
                                            <Link
                                                href={`/admin/trips/${trip.id}`}
                                                className="font-semibold text-(--primary) hover:underline"
                                            >
                                                {trip.tripNumber}
                                            </Link>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-(--text)">
                                                    {trip.origin} →{" "}
                                                    {trip.destination}
                                                </p>

                                                <p className="mt-1 text-xs text-(--text-muted)">
                                                    {trip.status
                                                        .split("_")
                                                        .map(
                                                            (word) =>
                                                                word
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                word.slice(1)
                                                        )
                                                        .join(" ")}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-(--text)">
                                                    {trip.pickupCompanyName}
                                                </p>

                                                <p className="mt-1 text-xs text-(--text-muted)">
                                                    Delivery:{" "}
                                                    {trip.deliveryCompanyName}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className="font-semibold text-(--text)">
                                                {formatCurrency(
                                                    paymentSummary.tripAmount
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <span className="font-semibold text-green-700">
                                                {formatCurrency(
                                                    paymentSummary.paidAmount
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={
                                                    paymentSummary
                                                        .remainingAmount > 0
                                                        ? "font-semibold text-amber-700"
                                                        : "font-semibold text-green-700"
                                                }
                                            >
                                                {formatCurrency(
                                                    paymentSummary.remainingAmount
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <PaymentStatusBadge
                                                status={
                                                    paymentSummary.paymentStatus
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Link
                                                href={`/admin/finance/trips/${trip.id}`}
                                                className="text-sm font-semibold text-(--primary) hover:underline"
                                            >
                                                View Payments
                                            </Link>
                                        </TableCell>
                                    </tr>
                                )
                            )}

                            {reportRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-5 py-12 text-center text-sm text-(--text-muted)"
                                    >
                                        No income records found for the
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

function PaymentStatusBadge({
    status,
}: {
    status:
    | "unpaid"
    | "partially_paid"
    | "paid";
}) {
    const styles = {
        unpaid:
            "bg-red-50 text-red-700",
        partially_paid:
            "bg-amber-50 text-amber-700",
        paid:
            "bg-green-50 text-green-700",
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