"use client";

import { maintenanceRecords } from "@/data/maintenanceRecords";
import { trucks } from "@/data/trucks";
import {
  CalendarClock,
  CircleDollarSign,
  Search,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter =
  | "all"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export default function MaintenanceReportPage() {
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

  const reportRows = useMemo(() => {
    if (invalidRange) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return maintenanceRecords
      .map((record) => {
        const truck = trucks.find(
          (item) => item.id === record.truckId
        );

        const totalCost =
          record.labourCost +
          record.partsCost +
          record.otherCost;

        return {
          record,
          truck,
          totalCost,
        };
      })
      .filter(({ record, truck }) => {
        const matchesSearch =
          !query ||
          [
            truck?.registrationNumber,
            truck?.truckNumber,
            record.workshopName,
            record.maintenanceType,
            record.description,
            record.receiptNumber,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesStatus =
          statusFilter === "all" ||
          record.status === statusFilter;

        const matchesStart =
          !startDate ||
          record.serviceDate >= startDate;

        const matchesEnd =
          !endDate ||
          record.serviceDate <= endDate;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesStart &&
          matchesEnd
        );
      })
      .sort(
        (a, b) =>
          new Date(
            b.record.serviceDate
          ).getTime() -
          new Date(
            a.record.serviceDate
          ).getTime()
      );
  }, [
    search,
    statusFilter,
    startDate,
    endDate,
    invalidRange,
  ]);

  const totalMaintenanceCost =
    reportRows.reduce(
      (total, row) =>
        total + row.totalCost,
      0
    );

  const completedRecords =
    reportRows.filter(
      ({ record }) =>
        record.status === "completed"
    ).length;

  const activeRecords =
    reportRows.filter(
      ({ record }) =>
        record.status === "scheduled" ||
        record.status === "in_progress"
    ).length;

  const trucksMaintained = new Set(
    reportRows.map(
      ({ record }) => record.truckId
    )
  ).size;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-(--text)">
          Maintenance Report
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Review truck maintenance activity,
          workshop history and maintenance costs.
        </p>
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
                placeholder="Truck, workshop, service..."
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
                  event.target
                    .value as StatusFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Statuses
              </option>

              <option value="scheduled">
                Scheduled
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
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
          label="Maintenance Cost"
          value={formatCurrency(
            totalMaintenanceCost
          )}
          subtitle={`${reportRows.length} records`}
          icon={CircleDollarSign}
        />

        <SummaryCard
          label="Completed"
          value={String(completedRecords)}
          subtitle="Completed maintenance"
          icon={Wrench}
        />

        <SummaryCard
          label="Active Services"
          value={String(activeRecords)}
          subtitle="Scheduled / in progress"
          icon={CalendarClock}
        />

        <SummaryCard
          label="Trucks Maintained"
          value={String(trucksMaintained)}
          subtitle="Unique trucks in report"
          icon={Truck}
        />
      </section>

      {/* Cost Note */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-medium text-(--text)">
          Maintenance cost is calculated from
          labour, parts and other costs.
        </p>

        <p className="mt-1 text-sm text-(--text-muted)">
          No separate total cost value is stored,
          which keeps the maintenance data
          consistent.
        </p>
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-5 py-4">
          <h3 className="font-semibold text-(--text)">
            Maintenance Records
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
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Date</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Workshop</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Labour</TableHead>
                <TableHead>Parts</TableHead>
                <TableHead>Other</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Service</TableHead>
              </tr>
            </thead>

            <tbody>
              {reportRows.map(
                ({
                  record,
                  truck,
                  totalCost,
                }) => (
                  <tr
                    key={record.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      {formatDate(
                        record.serviceDate
                      )}
                    </TableCell>

                    <TableCell>
                      {truck ? (
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="font-semibold text-(--primary) hover:underline"
                        >
                          {
                            truck.registrationNumber
                          }
                        </Link>
                      ) : (
                        `Truck #${record.truckId}`
                      )}
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-(--text)">
                          {formatText(
                            record.maintenanceType
                          )}
                        </p>

                        <p className="mt-1 max-w-[220px] truncate text-xs text-(--text-muted)">
                          {record.description}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {record.workshopName}
                    </TableCell>

                    <TableCell>
                      {formatNumber(
                        record.odometerKm
                      )}{" "}
                      km
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        record.labourCost
                      )}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        record.partsCost
                      )}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        record.otherCost
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-(--text)">
                        {formatCurrency(
                          totalCost
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={record.status}
                      />
                    </TableCell>

                    <TableCell>
                      <div>
                        <p>
                          {record.nextServiceDate
                            ? formatDate(
                                record.nextServiceDate
                              )
                            : "—"}
                        </p>

                        {record.nextServiceOdometerKm && (
                          <p className="mt-1 text-xs text-(--text-muted)">
                            {formatNumber(
                              record.nextServiceOdometerKm
                            )}{" "}
                            km
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </tr>
                )
              )}

              {reportRows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No maintenance records found
                    for the selected filters.
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
  status:
    | "scheduled"
    | "in_progress"
    | "completed"
    | "cancelled";
}) {
  const styles = {
    scheduled:
      "bg-blue-50 text-blue-700",
    in_progress:
      "bg-amber-50 text-amber-700",
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

function SummaryCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: typeof Wrench;
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-PK").format(
    value
  );
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