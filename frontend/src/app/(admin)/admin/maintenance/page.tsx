"use client";

import { maintenanceRecords } from "@/data/maintenanceRecords";
import { trucks } from "@/data/trucks";
import {
  MaintenanceStatus,
  MaintenanceType,
} from "@/types/maintenance";
import {
  CircleDollarSign,
  Clock3,
  Plus,
  Search,
  Settings,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const typeLabels: Record<
  MaintenanceType,
  string
> = {
  oil_change: "Oil Change",
  engine: "Engine",
  brakes: "Brakes",
  transmission: "Transmission",
  electrical: "Electrical",
  suspension: "Suspension",
  body_work: "Body Work",
  general_service: "General Service",
  emergency_repair: "Emergency Repair",
  other: "Other",
};

const statusLabels: Record<
  MaintenanceStatus,
  string
> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClasses: Record<
  MaintenanceStatus,
  string
> = {
  scheduled: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function MaintenancePage() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<MaintenanceStatus | "all">("all");

  const filteredRecords = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return maintenanceRecords.filter(
      (record) => {
        const truck = trucks.find(
          (item) =>
            item.id === record.truckId
        );

        const matchesStatus =
          statusFilter === "all" ||
          record.status === statusFilter;

        const matchesSearch =
          !query ||
          [
            truck?.registrationNumber,
            truck?.truckNumber,
            record.workshopName,
            record.description,
            record.receiptNumber,
            typeLabels[
              record.maintenanceType
            ],
            statusLabels[record.status],
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        return (
          matchesStatus && matchesSearch
        );
      }
    );
  }, [search, statusFilter]);

  const totalMaintenanceCost =
    maintenanceRecords.reduce(
      (sum, record) =>
        sum +
        record.labourCost +
        record.partsCost +
        record.otherCost,
      0
    );

  const inProgressCount =
    maintenanceRecords.filter(
      (record) =>
        record.status === "in_progress"
    ).length;

  const scheduledCount =
    maintenanceRecords.filter(
      (record) =>
        record.status === "scheduled"
    ).length;

  const trucksUnderMaintenance = new Set(
    maintenanceRecords
      .filter((record) =>
        ["scheduled", "in_progress"].includes(
          record.status
        )
      )
      .map((record) => record.truckId)
  ).size;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
            Maintenance
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Track truck servicing, repairs and
            maintenance costs.
          </p>
        </div>

        <Link
          href="/admin/maintenance/add"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-fit"
        >
          <Plus size={17} />
          Add Maintenance
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Maintenance Cost"
          value={`PKR ${totalMaintenanceCost.toLocaleString()}`}
          subtitle="All maintenance records"
          icon={CircleDollarSign}
        />

        <SummaryCard
          title="In Progress"
          value={String(inProgressCount)}
          subtitle="Currently being serviced"
          icon={Wrench}
        />

        <SummaryCard
          title="Scheduled"
          value={String(scheduledCount)}
          subtitle="Upcoming maintenance"
          icon={Clock3}
        />

        <SummaryCard
          title="Affected Trucks"
          value={String(
            trucksUnderMaintenance
          )}
          subtitle="Scheduled or in progress"
          icon={Truck}
        />
      </section>

      {/* Maintenance Records */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Filters Header */}
        <div className="flex flex-col gap-4 border-b border-(--border) p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Settings
                size={18}
                className="text-(--primary)"
              />

              <h3 className="font-semibold text-(--text)">
                Maintenance Records
              </h3>
            </div>

            <p className="mt-1 text-sm text-(--text-muted)">
              {filteredRecords.length} record
              {filteredRecords.length === 1
                ? ""
                : "s"}{" "}
              found.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            {/* Search */}
            <div className="relative w-full xl:w-72">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search maintenance..."
                className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | MaintenanceStatus
                    | "all"
                )
              }
              className="w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--primary) sm:w-auto"
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
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredRecords.map((record) => {
            const truck = trucks.find(
              (item) =>
                item.id === record.truckId
            );

            const totalCost =
              record.labourCost +
              record.partsCost +
              record.otherCost;

            return (
              <div
                key={record.id}
                className="p-4"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                        <Wrench size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-(--text)">
                          {
                            typeLabels[
                              record
                                .maintenanceType
                            ]
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-(--text-muted)">
                          {record.serviceDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      statusClasses[
                        record.status
                      ]
                    }`}
                  >
                    {
                      statusLabels[
                        record.status
                      ]
                    }
                  </span>
                </div>

                {/* Truck */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Truck
                  </p>

                  {truck ? (
                    <div className="mt-1">
                      <Link
                        href={`/admin/trucks/${truck.id}`}
                        className="text-sm font-semibold text-(--primary)"
                      >
                        {
                          truck.registrationNumber
                        }
                      </Link>

                      {truck.truckNumber && (
                        <span className="ml-2 text-xs text-(--text-muted)">
                          {truck.truckNumber}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-(--text)">
                      Unknown
                    </p>
                  )}
                </div>

                {/* Main Info */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <MobileInfo
                    label="Workshop"
                    value={record.workshopName}
                  />

                  <MobileInfo
                    label="Odometer"
                    value={`${record.odometerKm.toLocaleString()} km`}
                  />

                  <MobileInfo
                    label="Receipt"
                    value={
                      record.receiptNumber ??
                      "—"
                    }
                  />

                  <MobileInfo
                    label="Next Service"
                    value={
                      record.nextServiceDate ??
                      "—"
                    }
                  />
                </div>

                {/* Next Service Odometer */}
                {record.nextServiceOdometerKm && (
                  <div className="mt-4">
                    <MobileInfo
                      label="Next Service Odometer"
                      value={`${record.nextServiceOdometerKm.toLocaleString()} km`}
                    />
                  </div>
                )}

                {/* Description */}
                <div className="mt-4 rounded-xl border border-(--border) p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Description
                  </p>

                  <p className="mt-1 break-words text-sm text-(--text)">
                    {record.description}
                  </p>
                </div>

                {/* Cost */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-(--text-muted)">
                      Total Cost
                    </span>

                    <span className="text-right font-bold text-(--text)">
                      PKR{" "}
                      {totalCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-(--border) pt-3">
                    <CostItem
                      label="Labour"
                      value={record.labourCost}
                    />

                    <CostItem
                      label="Parts"
                      value={record.partsCost}
                    />

                    <CostItem
                      label="Other"
                      value={record.otherCost}
                    />
                  </div>
                </div>

                {/* Truck Link */}
                {truck && (
                  <Link
                    href={`/admin/trucks/${truck.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
                  >
                    <Truck size={16} />
                    View Truck
                  </Link>
                )}
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Date</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>
                  Maintenance
                </TableHead>
                <TableHead>Workshop</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>
                  Next Service
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map(
                (record) => {
                  const truck = trucks.find(
                    (item) =>
                      item.id ===
                      record.truckId
                  );

                  const totalCost =
                    record.labourCost +
                    record.partsCost +
                    record.otherCost;

                  return (
                    <tr
                      key={record.id}
                      className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                    >
                      <TableCell>
                        {record.serviceDate}
                      </TableCell>

                      <TableCell>
                        {truck ? (
                          <>
                            <Link
                              href={`/admin/trucks/${truck.id}`}
                              className="font-semibold text-(--text) hover:text-(--primary)"
                            >
                              {
                                truck.registrationNumber
                              }
                            </Link>

                            {truck.truckNumber && (
                              <p className="mt-1 text-xs text-(--text-muted)">
                                {
                                  truck.truckNumber
                                }
                              </p>
                            )}
                          </>
                        ) : (
                          "Unknown"
                        )}
                      </TableCell>

                      <TableCell>
                        <p className="font-medium text-(--text)">
                          {
                            typeLabels[
                              record
                                .maintenanceType
                            ]
                          }
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-(--text-muted)">
                          {record.description}
                        </p>
                      </TableCell>

                      <TableCell>
                        {record.workshopName}
                      </TableCell>

                      <TableCell>
                        {record.odometerKm.toLocaleString()}{" "}
                        km
                      </TableCell>

                      <TableCell>
                        <p className="font-semibold text-(--text)">
                          PKR{" "}
                          {totalCost.toLocaleString()}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          Labour{" "}
                          {record.labourCost.toLocaleString()}
                          {" + "}
                          Parts{" "}
                          {record.partsCost.toLocaleString()}
                        </p>
                      </TableCell>

                      <TableCell>
                        {record.nextServiceDate ? (
                          <p className="font-medium text-(--text)">
                            {
                              record.nextServiceDate
                            }
                          </p>
                        ) : (
                          <p>—</p>
                        )}

                        {record.nextServiceOdometerKm && (
                          <p className="mt-1 text-xs text-(--text-muted)">
                            {record.nextServiceOdometerKm.toLocaleString()}{" "}
                            km
                          </p>
                        )}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusClasses[
                              record.status
                            ]
                          }`}
                        >
                          {
                            statusLabels[
                              record.status
                            ]
                          }
                        </span>
                      </TableCell>

                      <TableCell>
                        {record.receiptNumber ??
                          "—"}
                      </TableCell>
                    </tr>
                  );
                }
              )}

              {filteredRecords.length ===
                0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No maintenance records
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

function CostItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-[11px] text-(--text-muted)">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-semibold text-(--text)">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-10 text-center">
      <Wrench
        size={28}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm text-(--text-muted)">
        No maintenance records found.
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
  icon: typeof Wrench;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted) sm:text-sm">
            {title}
          </p>

          <p className="mt-2 break-words text-lg font-bold text-(--text) sm:text-xl">
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