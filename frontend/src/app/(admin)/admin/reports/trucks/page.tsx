"use client";

import { trucks } from "@/data/trucks";
import { trips } from "@/data/trips";
import { TruckStatus } from "@/types/truck";
import {
  exportReportToExcel,
  exportReportToPDF,
} from "@/lib/reportExport";
import {
  Activity,
  Gauge,
  Package,
  Download,
  FileSpreadsheet,
  Search,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter = TruckStatus | "all";

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All Statuses" },
  { value: "available", label: "Available" },
  { value: "assigned", label: "Assigned" },
  { value: "on_trip", label: "On Trip" },
  { value: "maintenance", label: "Maintenance" },
  { value: "breakdown", label: "Breakdown" },
  { value: "inactive", label: "Inactive" },
];

export default function TruckReportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const reportRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return trucks
      .filter((truck) => {
        const matchesSearch =
          !query ||
          [
            truck.registrationNumber,
            truck.truckNumber,
            truck.manufacturer,
            truck.model,
            truck.truckType,
            truck.assignedDriver,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesStatus =
          statusFilter === "all" ||
          truck.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .map((truck) => {
        const truckTrips = trips.filter(
          (trip) =>
            trip.truckId === truck.id &&
            trip.status !== "cancelled"
        );

        const completedTrips = truckTrips.filter(
          (trip) => trip.status === "completed"
        ).length;

        const activeTrip = truckTrips.find(
          (trip) =>
            trip.status === "started" ||
            trip.status === "in_transit"
        );

        const currentLoadKg =
          activeTrip?.loadedWeightKg ?? 0;

        const utilization =
          truck.capacityKg > 0
            ? (currentLoadKg /
                truck.capacityKg) *
              100
            : 0;

        return {
          truck,
          totalTrips: truckTrips.length,
          completedTrips,
          currentLoadKg,
          utilization,
        };
      });
  }, [search, statusFilter]);

  const totalCapacity = reportRows.reduce(
    (total, row) =>
      total + row.truck.capacityKg,
    0
  );

  const currentLoad = reportRows.reduce(
    (total, row) =>
      total + row.currentLoadKg,
    0
  );

  const activeTrucks = reportRows.filter(
    ({ truck }) =>
      truck.status !== "inactive" &&
      truck.status !== "breakdown"
  ).length;

  const exportColumns = [
  {
    header: "Registration",
    value: (row: (typeof reportRows)[number]) =>
      row.truck.registrationNumber,
  },
  {
    header: "Truck Number",
    value: (row: (typeof reportRows)[number]) =>
      row.truck.truckNumber ?? "—",
  },
  {
    header: "Vehicle",
    value: (row: (typeof reportRows)[number]) =>
      `${row.truck.manufacturer} ${row.truck.model}`,
  },
  {
    header: "Model Year",
    value: (row: (typeof reportRows)[number]) =>
      row.truck.modelYear,
  },
  {
    header: "Truck Type",
    value: (row: (typeof reportRows)[number]) =>
      row.truck.truckType,
  },
  {
    header: "Driver",
    value: (row: (typeof reportRows)[number]) =>
      row.truck.assignedDriver ?? "Unassigned",
  },
  {
    header: "Capacity (kg)",
    value: (row: (typeof reportRows)[number]) =>
      row.truck.capacityKg,
  },
  {
    header: "Current Load (kg)",
    value: (row: (typeof reportRows)[number]) =>
      row.currentLoadKg,
  },
  {
    header: "Utilization",
    value: (row: (typeof reportRows)[number]) =>
      `${row.utilization.toFixed(0)}%`,
  },
  {
    header: "Total Trips",
    value: (row: (typeof reportRows)[number]) =>
      row.totalTrips,
  },
  {
    header: "Completed Trips",
    value: (row: (typeof reportRows)[number]) =>
      row.completedTrips,
  },
  {
    header: "Status",
    value: (row: (typeof reportRows)[number]) =>
      formatText(row.truck.status),
  },
];

const exportSummary = [
  {
    label: "Total Trucks",
    value: reportRows.length,
  },
  {
    label: "Operational Trucks",
    value: activeTrucks,
  },
  {
    label: "Fleet Capacity",
    value: formatWeight(totalCapacity),
  },
  {
    label: "Current Load",
    value: formatWeight(currentLoad),
  },
];

function handlePDFExport() {
  exportReportToPDF({
    title: "Truck Report",
    fileName: "truck-report",
    columns: exportColumns,
    rows: reportRows,
    summary: exportSummary,
  });
}

function handleExcelExport() {
  exportReportToExcel({
    title: "Truck Report",
    fileName: "truck-report",
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
      Truck Report
    </h2>

    <p className="mt-1 text-sm text-(--text-muted)">
      Review fleet capacity, operational status,
      current load and trip activity.
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
        <div className="grid gap-4 md:grid-cols-2">
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
                placeholder="Registration, truck, model, driver..."
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
              {statusOptions.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Trucks"
          value={String(reportRows.length)}
          subtitle="Trucks in current results"
          icon={Truck}
        />

        <SummaryCard
          label="Operational Trucks"
          value={String(activeTrucks)}
          subtitle="Excludes inactive & breakdown"
          icon={Activity}
        />

        <SummaryCard
          label="Fleet Capacity"
          value={formatWeight(totalCapacity)}
          subtitle="Combined maximum capacity"
          icon={Package}
        />

        <SummaryCard
          label="Current Load"
          value={formatWeight(currentLoad)}
          subtitle="Started / in-transit trips"
          icon={Gauge}
        />
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-5 py-4">
          <h3 className="font-semibold text-(--text)">
            Fleet Records
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {reportRows.length} truck
            {reportRows.length === 1 ? "" : "s"} found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Truck</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Current Load</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Trips</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {reportRows.map(
                ({
                  truck,
                  totalTrips,
                  completedTrips,
                  currentLoadKg,
                  utilization,
                }) => (
                  <tr
                    key={truck.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-(--text)">
                          {
                            truck.registrationNumber
                          }
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {truck.truckNumber ?? "—"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-(--text)">
                          {truck.manufacturer}{" "}
                          {truck.model}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {truck.modelYear} •{" "}
                          {truck.truckType}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {truck.assignedDriver ??
                        "Unassigned"}
                    </TableCell>

                    <TableCell>
                      {formatWeight(
                        truck.capacityKg
                      )}
                    </TableCell>

                    <TableCell>
                      {formatWeight(
                        currentLoadKg
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="w-32">
                        <div className="mb-1 flex justify-between text-xs">
                          <span>
                            {utilization.toFixed(0)}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-(--primary)"
                            style={{
                              width: `${Math.min(
                                utilization,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        {utilization > 100 && (
                          <p className="mt-1 text-xs font-semibold text-(--danger)">
                            Overloaded
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-semibold text-(--text)">
                          {totalTrips}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {completedTrips} completed
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={truck.status}
                      />
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/trucks/${truck.id}`}
                        className="text-sm font-semibold text-(--primary) hover:underline"
                      >
                        View
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
                    No trucks found for the selected
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

function StatusBadge({
  status,
}: {
  status: TruckStatus;
}) {
  const styles: Record<TruckStatus, string> = {
    available:
      "bg-green-50 text-green-700",
    assigned:
      "bg-blue-50 text-blue-700",
    on_trip:
      "bg-indigo-50 text-indigo-700",
    maintenance:
      "bg-amber-50 text-amber-700",
    breakdown:
      "bg-red-50 text-red-700",
    inactive:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {formatText(status)}
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

function formatWeight(value: number) {
  return `${(value / 1000).toLocaleString("en-PK", {
    maximumFractionDigits: 1,
  })} tons`;
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