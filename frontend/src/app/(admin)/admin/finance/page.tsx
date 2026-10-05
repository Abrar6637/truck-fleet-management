"use client";

import { tripPayments } from "@/data/tripPayments";
import { trips } from "@/data/trips";
import {
  calculateTripPayment,
  TripPaymentStatus,
} from "@/lib/tripPayment";
import {
  Banknote,
  CircleDollarSign,
  Clock3,
  Search,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter = TripPaymentStatus | "all";

const statusLabels: Record<
  TripPaymentStatus,
  string
> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  paid: "Paid",
};

const statusClasses: Record<
  TripPaymentStatus,
  string
> = {
  unpaid: "bg-red-50 text-red-700",
  partially_paid:
    "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
};

export default function FinancePage() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const rows = useMemo(() => {
    return trips.map((trip) => ({
      trip,
      summary: calculateTripPayment(
        trip.id,
        trip.tripAmount,
        tripPayments
      ),
    }));
  }, []);

  const filteredRows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return rows.filter(
      ({ trip, summary }) => {
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

        const matchesStatus =
          statusFilter === "all" ||
          summary.paymentStatus ===
            statusFilter;

        return (
          matchesSearch && matchesStatus
        );
      }
    );
  }, [rows, search, statusFilter]);

  const totalTripValue = rows.reduce(
    (total, row) =>
      total + row.summary.tripAmount,
    0
  );

  const totalReceived = rows.reduce(
    (total, row) =>
      total + row.summary.paidAmount,
    0
  );

  const totalOutstanding = rows.reduce(
    (total, row) =>
      total + row.summary.remainingAmount,
    0
  );

  const pendingTrips = rows.filter(
    (row) =>
      row.summary.paymentStatus !== "paid"
  ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
          Finance
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Monitor trip income, received payments
          and outstanding balances.
        </p>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Trip Revenue"
          value={formatCurrency(
            totalTripValue
          )}
          subtitle="Total value of trip records"
          icon={CircleDollarSign}
        />

        <SummaryCard
          title="Received"
          value={formatCurrency(
            totalReceived
          )}
          subtitle="Customer payments recorded"
          icon={Banknote}
        />

        <SummaryCard
          title="Outstanding"
          value={formatCurrency(
            totalOutstanding
          )}
          subtitle="Amount still receivable"
          icon={WalletCards}
        />

        <SummaryCard
          title="Pending Trips"
          value={String(pendingTrips)}
          subtitle="Unpaid or partially paid"
          icon={Clock3}
        />
      </section>

      {/* Payment Records */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Filters */}
        <div className="border-b border-(--border) p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-(--text)">
                Trip Payments
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                {filteredRows.length} trip
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
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search trip, route or company..."
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
                  All Payment Status
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

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredRows.map(
            ({ trip, summary }) => {
              const paidPercentage =
                summary.tripAmount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (summary.paidAmount /
                          summary.tripAmount) *
                          100
                      )
                    )
                  : 100;

              return (
                <div
                  key={trip.id}
                  className="p-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="font-semibold text-(--text) transition hover:text-(--primary)"
                      >
                        {trip.tripNumber}
                      </Link>

                      <p className="mt-1 break-words text-sm text-(--text-muted)">
                        {trip.origin} →{" "}
                        {trip.destination}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusClasses[
                          summary.paymentStatus
                        ]
                      }`}
                    >
                      {
                        statusLabels[
                          summary.paymentStatus
                        ]
                      }
                    </span>
                  </div>

                  {/* Companies */}
                  <div className="mt-4 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                    <MobileInfo
                      label="Pickup Company"
                      value={
                        trip.pickupCompanyName
                      }
                    />

                    <MobileInfo
                      label="Delivery Company"
                      value={
                        trip.deliveryCompanyName
                      }
                    />
                  </div>

                  {/* Payment Summary */}
                  <div className="mt-4 overflow-hidden rounded-xl border border-(--border)">
                    <PaymentRow
                      label="Trip Amount"
                      value={formatCurrency(
                        summary.tripAmount
                      )}
                      strong
                    />

                    <PaymentRow
                      label="Received"
                      value={formatCurrency(
                        summary.paidAmount
                      )}
                      success={
                        summary.paidAmount > 0
                      }
                    />

                    <PaymentRow
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

                  {/* Payment Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-(--text-muted)">
                        Payment Progress
                      </p>

                      <p className="text-xs font-semibold text-(--text)">
                        {paidPercentage}%
                      </p>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-(--primary) transition-all"
                        style={{
                          width: `${paidPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
                    <Link
                      href={`/admin/trips/${trip.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
                    >
                      View Trip
                    </Link>

                    <Link
                      href={`/admin/finance/trips/${trip.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
                    >
                      View Payments
                    </Link>
                  </div>
                </div>
              );
            }
          )}

          {filteredRows.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Trip</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>
                  Pickup Company
                </TableHead>
                <TableHead>
                  Trip Amount
                </TableHead>
                <TableHead>
                  Received
                </TableHead>
                <TableHead>
                  Remaining
                </TableHead>
                <TableHead>
                  Payment Status
                </TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map(
                ({ trip, summary }) => (
                  <tr
                    key={trip.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="font-semibold text-(--text) transition hover:text-(--primary)"
                      >
                        {trip.tripNumber}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-(--text)">
                          {trip.origin}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          →{" "}
                          {trip.destination}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {
                        trip.pickupCompanyName
                      }
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-(--text)">
                        {formatCurrency(
                          summary.tripAmount
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
                            summary.paymentStatus
                          ]
                        }`}
                      >
                        {
                          statusLabels[
                            summary.paymentStatus
                          ]
                        }
                      </span>
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

              {filteredRows.length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No trip payment records
                    found.
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
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-(--text)">
        {value}
      </p>
    </div>
  );
}

function PaymentRow({
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
        No trip payment records found.
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