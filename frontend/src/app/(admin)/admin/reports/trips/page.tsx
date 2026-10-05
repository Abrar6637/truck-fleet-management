"use client";

import { trips } from "@/data/trips";
import { drivers } from "@/data/drivers";
import { trucks } from "@/data/trucks";
import { TripStatus } from "@/types/trip";
import {
  exportReportToExcel,
  exportReportToPDF,
} from "@/lib/reportExport";
import {
  Banknote,
  CalendarDays,
  Package,
   Download,
  FileSpreadsheet,
  Search,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter = TripStatus | "all";

const tripStatuses: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All Statuses" },
  { value: "created", label: "Created" },
  { value: "assigned", label: "Assigned" },
  { value: "started", label: "Started" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function TripReportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [startDate, setStartDate] =
    useState("2026-09-01");

  const [endDate, setEndDate] =
    useState("2026-10-31");

  const invalidRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    startDate > endDate;

  const filteredTrips = useMemo(() => {
    if (invalidRange) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return trips
      .filter((trip) => {
        const truck = trucks.find(
          (item) => item.id === trip.truckId
        );

        const driver = drivers.find(
          (item) => item.id === trip.driverId
        );

        const matchesSearch =
          !query ||
          [
            trip.tripNumber,
            trip.origin,
            trip.destination,
            trip.pickupCompanyName,
            trip.deliveryCompanyName,
            truck?.registrationNumber,
            truck?.truckNumber,
            driver?.name,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesStatus =
          statusFilter === "all" ||
          trip.status === statusFilter;

        const matchesStartDate =
          !startDate ||
          trip.startDate >= startDate;

        const matchesEndDate =
          !endDate ||
          trip.startDate <= endDate;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesStartDate &&
          matchesEndDate
        );
      })
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() -
          new Date(a.startDate).getTime()
      );
  }, [
    search,
    statusFilter,
    startDate,
    endDate,
    invalidRange,
  ]);

  const totalLoad = filteredTrips.reduce(
    (total, trip) =>
      total + trip.loadedWeightKg,
    0
  );

  const totalRevenue = filteredTrips
    .filter((trip) => trip.status !== "cancelled")
    .reduce(
      (total, trip) =>
        total + trip.tripAmount,
      0
    );

  const activeTrips = filteredTrips.filter(
    (trip) =>
      trip.status === "started" ||
      trip.status === "in_transit"
  ).length;
  const exportColumns = [
  {
    header: "Trip Number",
    value: (trip: (typeof trips)[number]) =>
      trip.tripNumber,
  },
  {
    header: "Date",
    value: (trip: (typeof trips)[number]) =>
      formatDate(trip.startDate),
  },
  {
    header: "Origin",
    value: (trip: (typeof trips)[number]) =>
      trip.origin,
  },
  {
    header: "Destination",
    value: (trip: (typeof trips)[number]) =>
      trip.destination,
  },
  {
    header: "Pickup Company",
    value: (trip: (typeof trips)[number]) =>
      trip.pickupCompanyName,
  },
  {
    header: "Delivery Company",
    value: (trip: (typeof trips)[number]) =>
      trip.deliveryCompanyName,
  },
  {
    header: "Truck",
    value: (trip: (typeof trips)[number]) =>
      trucks.find(
        (truck) => truck.id === trip.truckId
      )?.registrationNumber ?? "—",
  },
  {
    header: "Driver",
    value: (trip: (typeof trips)[number]) =>
      drivers.find(
        (driver) => driver.id === trip.driverId
      )?.name ?? "—",
  },
  {
    header: "Load (kg)",
    value: (trip: (typeof trips)[number]) =>
      trip.loadedWeightKg,
  },
  {
    header: "Status",
    value: (trip: (typeof trips)[number]) =>
      formatText(trip.status),
  },
  {
    header: "Revenue (PKR)",
    value: (trip: (typeof trips)[number]) =>
      trip.status === "cancelled"
        ? 0
        : trip.tripAmount,
  },
];

const exportSummary = [
  {
    label: "Total Trips",
    value: filteredTrips.length,
  },
  {
    label: "Active Trips",
    value: activeTrips,
  },
  {
    label: "Total Load",
    value: formatWeight(totalLoad),
  },
  {
    label: "Trip Revenue",
    value: formatCurrency(totalRevenue),
  },
];

function handlePDFExport() {
  exportReportToPDF({
    title: "Trip Report",
    fileName: "trip-report",
    columns: exportColumns,
    rows: filteredTrips,
    summary: exportSummary,
  });
}

function handleExcelExport() {
  exportReportToExcel({
    title: "Trip Report",
    fileName: "trip-report",
    columns: exportColumns,
    rows: filteredTrips,
    summary: exportSummary,
  });
}

  return (
    <div className="space-y-7">
      {/* Header */}
     
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div>
    <h2 className="text-2xl font-bold text-(--text)">
      Trip Report
    </h2>

    <p className="mt-1 text-sm text-(--text-muted)">
      Analyze fleet trips, routes, load weights,
      statuses and trip revenue.
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
    <button
      type="button"
      onClick={handlePDFExport}
      disabled={filteredTrips.length === 0}
      className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={17} />
      Download PDF
    </button>

    <button
      type="button"
      onClick={handleExcelExport}
      disabled={filteredTrips.length === 0}
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
                placeholder="Trip, route, truck, driver..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter
                )
              }
              className={inputClass}
            >
              {tripStatuses.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
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
          label="Total Trips"
          value={String(filteredTrips.length)}
          subtitle="Trips in selected period"
          icon={Truck}
        />

        <SummaryCard
          label="Active Trips"
          value={String(activeTrips)}
          subtitle="Started or in transit"
          icon={CalendarDays}
        />

        <SummaryCard
          label="Total Load"
          value={formatWeight(totalLoad)}
          subtitle="Combined loaded weight"
          icon={Package}
        />

        <SummaryCard
          label="Trip Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Excludes cancelled trips"
          icon={Banknote}
        />
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-5 py-4">
          <h3 className="font-semibold text-(--text)">
            Trip Records
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {filteredTrips.length} trip
            {filteredTrips.length === 1
              ? ""
              : "s"}{" "}
            found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Trip</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Load</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredTrips.map((trip) => {
                const truck = trucks.find(
                  (item) =>
                    item.id === trip.truckId
                );

                const driver = drivers.find(
                  (item) =>
                    item.id === trip.driverId
                );

                return (
                  <tr
                    key={trip.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-(--text)">
                          {trip.tripNumber}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {trip.pickupCompanyName}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        trip.startDate
                      )}
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-(--text)">
                          {trip.origin} →{" "}
                          {trip.destination}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          To:{" "}
                          {trip.deliveryCompanyName}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {truck ? (
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="font-medium text-(--primary) hover:underline"
                        >
                          {
                            truck.registrationNumber
                          }
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {driver ? (
                        <Link
                          href={`/admin/drivers/${driver.id}`}
                          className="font-medium text-(--primary) hover:underline"
                        >
                          {driver.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {formatWeight(
                        trip.loadedWeightKg
                      )}
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={trip.status}
                      />
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          trip.status ===
                          "cancelled"
                            ? "text-(--text-muted) line-through"
                            : "font-semibold text-(--text)"
                        }
                      >
                        {formatCurrency(
                          trip.tripAmount
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="text-sm font-semibold text-(--primary) hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </tr>
                );
              })}

              {filteredTrips.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No trips found for the selected
                    filters.
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
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: typeof Truck;
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

function StatusBadge({
  status,
}: {
  status: TripStatus;
}) {
  const styles: Record<TripStatus, string> = {
    created:
      "bg-slate-100 text-slate-700",
    assigned:
      "bg-blue-50 text-blue-700",
    started:
      "bg-amber-50 text-amber-700",
    in_transit:
      "bg-indigo-50 text-indigo-700",
    delivered:
      "bg-emerald-50 text-emerald-700",
    completed:
      "bg-green-50 text-green-700",
    cancelled:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {formatText(status)}
    </span>
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

function formatWeight(value: number) {
  return `${(
    value / 1000
  ).toLocaleString("en-PK", {
    maximumFractionDigits: 1,
  })} tons`;
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