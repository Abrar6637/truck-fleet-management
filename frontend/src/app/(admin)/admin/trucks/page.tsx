"use client";

import { trucks } from "@/data/trucks";
import { TruckStatus } from "@/types/truck";
import {
  AlertTriangle,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusLabels: Record<TruckStatus, string> = {
  available: "Available",
  assigned: "Assigned",
  on_trip: "On Trip",
  maintenance: "Maintenance",
  breakdown: "Breakdown",
  inactive: "Inactive",
};

const statusClasses: Record<TruckStatus, string> = {
  available: "bg-green-50 text-green-700",
  assigned: "bg-indigo-50 text-indigo-700",
  on_trip: "bg-blue-50 text-blue-700",
  maintenance: "bg-amber-50 text-amber-700",
  breakdown: "bg-red-50 text-red-700",
  inactive: "bg-slate-100 text-slate-600",
};

export default function TrucksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TruckStatus | "all">("all");

  const filteredTrucks = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return trucks.filter((truck) => {
      const matchesSearch =
        !searchValue ||
        truck.registrationNumber
          .toLowerCase()
          .includes(searchValue) ||
        truck.truckNumber
          ?.toLowerCase()
          .includes(searchValue) ||
        truck.manufacturer
          .toLowerCase()
          .includes(searchValue) ||
        truck.model
          .toLowerCase()
          .includes(searchValue) ||
        truck.assignedDriver
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        truck.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const availableCount = trucks.filter(
    (truck) => truck.status === "available"
  ).length;

  const onTripCount = trucks.filter(
    (truck) => truck.status === "on_trip"
  ).length;

  const attentionCount = trucks.filter(
    (truck) =>
      truck.status === "maintenance" ||
      truck.status === "breakdown"
  ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-(--text) sm:text-2xl">
            Trucks
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage and monitor all trucks in your
            fleet.
          </p>
        </div>

        <Link
          href="/admin/trucks/add"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-auto"
        >
          <Plus size={18} />
          Add Truck
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Trucks"
          value={trucks.length}
          icon={Truck}
        />

        <SummaryCard
          title="Available"
          value={availableCount}
          icon={Truck}
        />

        <SummaryCard
          title="On Trip"
          value={onTripCount}
          icon={Truck}
        />

        <SummaryCard
          title="Needs Attention"
          value={attentionCount}
          icon={AlertTriangle}
        />
      </section>

      {/* Truck List */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Search / Filters */}
        <div className="flex flex-col gap-3 border-b border-(--border) p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search truck, driver, manufacturer..."
              className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-11 pr-4 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | TruckStatus
                  | "all"
              )
            }
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--primary) lg:w-auto lg:min-w-[180px]"
          >
            <option value="all">
              All Statuses
            </option>
            <option value="available">
              Available
            </option>
            <option value="assigned">
              Assigned
            </option>
            <option value="on_trip">
              On Trip
            </option>
            <option value="maintenance">
              Maintenance
            </option>
            <option value="breakdown">
              Breakdown
            </option>
            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredTrucks.map((truck) => (
            <div
              key={truck.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-(--text)">
                    {truck.registrationNumber}
                  </p>

                  <p className="mt-1 text-xs text-(--text-muted)">
                    {truck.truckNumber ??
                      "No fleet number"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[truck.status]}`}
                >
                  {statusLabels[truck.status]}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                <MobileInfo
                  label="Truck"
                  value={`${truck.manufacturer} ${truck.model}`}
                />

                <MobileInfo
                  label="Type"
                  value={truck.truckType}
                />

                <MobileInfo
                  label="Capacity"
                  value={`${(
                    truck.capacityKg / 1000
                  ).toFixed(0)} tons`}
                />

                <MobileInfo
                  label="Odometer"
                  value={`${truck.currentOdometerKm.toLocaleString()} km`}
                />

                <div className="col-span-2">
                  <MobileInfo
                    label="Driver"
                    value={
                      truck.assignedDriver ??
                      "Unassigned"
                    }
                  />
                </div>
              </div>

              <Link
                href={`/admin/trucks/${truck.id}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
              >
                View Truck
              </Link>
            </div>
          ))}

          {filteredTrucks.length === 0 && (
            <div className="px-4 py-12 text-center">
              <Truck
                size={30}
                className="mx-auto text-(--text-muted)"
              />

              <p className="mt-3 text-sm text-(--text-muted)">
                No trucks found matching your
                search.
              </p>
            </div>
          )}
        </div>

        {/* Desktop / Tablet Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
                <th className="px-6 py-4">
                  Truck
                </th>
                <th className="px-6 py-4">
                  Type
                </th>
                <th className="px-6 py-4">
                  Capacity
                </th>
                <th className="px-6 py-4">
                  Driver
                </th>
                <th className="px-6 py-4">
                  Odometer
                </th>
                <th className="px-6 py-4">
                  Status
                </th>
                <th className="px-6 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTrucks.map((truck) => (
                <tr
                  key={truck.id}
                  className="border-t border-(--border) text-sm transition hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-(--text)">
                      {truck.registrationNumber}
                    </p>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      {truck.truckNumber ??
                        "No fleet number"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-(--text)">
                      {truck.manufacturer}{" "}
                      {truck.model}
                    </p>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      {truck.truckType} •{" "}
                      {truck.modelYear}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-(--text)">
                    {(
                      truck.capacityKg / 1000
                    ).toFixed(0)}{" "}
                    tons
                  </td>

                  <td className="px-6 py-4 text-(--text)">
                    {truck.assignedDriver ?? (
                      <span className="text-(--text-muted)">
                        Unassigned
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-(--text)">
                    {truck.currentOdometerKm.toLocaleString()}{" "}
                    km
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[truck.status]}`}
                    >
                      {
                        statusLabels[
                          truck.status
                        ]
                      }
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/trucks/${truck.id}`}
                      className="text-sm font-semibold text-(--primary) hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredTrucks.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No trucks found matching your
                    search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-(--border) px-4 py-4 sm:px-6">
          <p className="text-xs text-(--text-muted)">
            Showing {filteredTrucks.length} of{" "}
            {trucks.length} trucks
          </p>
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

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Truck;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted) sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-(--text) sm:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary) sm:h-11 sm:w-11">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}