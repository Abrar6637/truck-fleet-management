"use client";

import { drivers } from "@/data/drivers";
import { trips } from "@/data/trips";
import { trucks } from "@/data/trucks";
import { TripStatus } from "@/types/trip";
import {
  CheckCircle2,
  MapPinned,
  Package,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusLabels: Record<TripStatus, string> = {
  created: "Created",
  assigned: "Assigned",
  started: "Started",
  in_transit: "In Transit",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClasses: Record<TripStatus, string> = {
  created: "bg-slate-100 text-slate-700",
  assigned: "bg-indigo-50 text-indigo-700",
  started: "bg-cyan-50 text-cyan-700",
  in_transit: "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TripStatus | "all">("all");

  const getTruck = (truckId: number) =>
    trucks.find((truck) => truck.id === truckId);

  const getDriver = (driverId: number) =>
    drivers.find((driver) => driver.id === driverId);

  const filteredTrips = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return trips.filter((trip) => {
      const truck = getTruck(trip.truckId);
      const driver = getDriver(trip.driverId);

      const matchesSearch =
        !searchValue ||
        trip.tripNumber
          .toLowerCase()
          .includes(searchValue) ||
        trip.origin
          .toLowerCase()
          .includes(searchValue) ||
        trip.destination
          .toLowerCase()
          .includes(searchValue) ||
        trip.goodsType
          .toLowerCase()
          .includes(searchValue) ||
        truck?.registrationNumber
          .toLowerCase()
          .includes(searchValue) ||
        driver?.name
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        trip.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeTrips = trips.filter((trip) =>
    ["started", "in_transit"].includes(trip.status)
  ).length;

  const upcomingTrips = trips.filter(
    (trip) =>
      trip.status === "created" ||
      trip.status === "assigned"
  ).length;

  const completedTrips = trips.filter(
    (trip) => trip.status === "completed"
  ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-(--text) sm:text-2xl">
            Trips
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage fleet trips, routes, loads,
            drivers, and delivery status.
          </p>
        </div>

        <Link
          href="/admin/trips/add"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-auto"
        >
          <Plus size={18} />
          Add Trip
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Trips"
          value={trips.length}
          icon={MapPinned}
        />

        <SummaryCard
          title="Active Trips"
          value={activeTrips}
          icon={Truck}
        />

        <SummaryCard
          title="Upcoming"
          value={upcomingTrips}
          icon={Package}
        />

        <SummaryCard
          title="Completed"
          value={completedTrips}
          icon={CheckCircle2}
        />
      </section>

      {/* Trips List */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Search & Filter */}
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
              placeholder="Search trip, route, truck, driver..."
              className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-11 pr-4 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | TripStatus
                  | "all"
              )
            }
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--primary) lg:w-auto lg:min-w-[180px]"
          >
            <option value="all">
              All Statuses
            </option>
            <option value="created">
              Created
            </option>
            <option value="assigned">
              Assigned
            </option>
            <option value="started">
              Started
            </option>
            <option value="in_transit">
              In Transit
            </option>
            <option value="delivered">
              Delivered
            </option>
            <option value="completed">
              Completed
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredTrips.map((trip) => {
            const truck = getTruck(trip.truckId);
            const driver = getDriver(trip.driverId);

            const capacityKg =
              truck?.capacityKg ?? 0;

            const utilization =
              capacityKg > 0
                ? Math.round(
                    (trip.loadedWeightKg /
                      capacityKg) *
                      100
                  )
                : 0;

            const remainingCapacity = Math.max(
              capacityKg - trip.loadedWeightKg,
              0
            );

            return (
              <div
                key={trip.id}
                className="p-4"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/trips/${trip.id}`}
                      className="font-semibold text-(--primary)"
                    >
                      {trip.tripNumber}
                    </Link>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      {trip.startDate}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[trip.status]}`}
                  >
                    {statusLabels[trip.status]}
                  </span>
                </div>

                {/* Route */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Route
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-(--text)">
                    <span className="min-w-0 truncate">
                      {trip.origin}
                    </span>

                    <span className="shrink-0 text-(--text-muted)">
                      →
                    </span>

                    <span className="min-w-0 truncate">
                      {trip.destination}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <MobileInfo
                    label="Truck"
                    value={
                      truck?.registrationNumber ??
                      "Not found"
                    }
                  />

                  <MobileInfo
                    label="Driver"
                    value={
                      driver?.name ??
                      "Not found"
                    }
                  />

                  <MobileInfo
                    label="Load"
                    value={`${(
                      trip.loadedWeightKg / 1000
                    ).toFixed(1)} tons`}
                  />

                  <MobileInfo
                    label="Amount"
                    value={`PKR ${trip.tripAmount.toLocaleString()}`}
                  />

                  <MobileInfo
                    label="Goods"
                    value={trip.goodsType}
                  />

                  <MobileInfo
                    label="Remaining"
                    value={`${remainingCapacity.toLocaleString()} kg`}
                  />
                </div>

                {/* Utilization */}
                <div className="mt-4 rounded-xl border border-(--border) p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-(--text-muted)">
                      Capacity Utilization
                    </span>

                    <span
                      className={`text-sm font-bold ${
                        utilization > 100
                          ? "text-(--danger)"
                          : utilization >= 90
                            ? "text-amber-600"
                            : "text-(--primary)"
                      }`}
                    >
                      {utilization}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        utilization > 100
                          ? "bg-(--danger)"
                          : utilization >= 90
                            ? "bg-(--warning)"
                            : "bg-(--primary)"
                      }`}
                      style={{
                        width: `${Math.min(
                          utilization,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-(--text-muted)">
                    Truck capacity:{" "}
                    {capacityKg / 1000} tons
                  </p>
                </div>

                <Link
                  href={`/admin/trips/${trip.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
                >
                  View Trip
                </Link>
              </div>
            );
          })}

          {filteredTrips.length === 0 && (
            <div className="px-4 py-12 text-center">
              <MapPinned
                size={30}
                className="mx-auto text-(--text-muted)"
              />

              <p className="mt-3 text-sm text-(--text-muted)">
                No trips found matching your search
                or filter.
              </p>
            </div>
          )}
        </div>

        {/* Desktop / Tablet Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
                <th className="px-6 py-4">
                  Trip
                </th>
                <th className="px-6 py-4">
                  Route
                </th>
                <th className="px-6 py-4">
                  Truck / Driver
                </th>
                <th className="px-6 py-4">
                  Load
                </th>
                <th className="px-6 py-4">
                  Utilization
                </th>
                <th className="px-6 py-4">
                  Amount
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
              {filteredTrips.map((trip) => {
                const truck = getTruck(
                  trip.truckId
                );

                const driver = getDriver(
                  trip.driverId
                );

                const capacityKg =
                  truck?.capacityKg ?? 0;

                const utilization =
                  capacityKg > 0
                    ? Math.round(
                        (trip.loadedWeightKg /
                          capacityKg) *
                          100
                      )
                    : 0;

                const remainingCapacity =
                  Math.max(
                    capacityKg -
                      trip.loadedWeightKg,
                    0
                  );

                return (
                  <tr
                    key={trip.id}
                    className="border-t border-(--border) text-sm transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="font-semibold text-(--primary) hover:underline"
                      >
                        {trip.tripNumber}
                      </Link>

                      <p className="mt-1 text-xs text-(--text-muted)">
                        {trip.startDate}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-(--text)">
                        {trip.origin}
                      </p>

                      <p className="mt-1 text-xs text-(--text-muted)">
                        → {trip.destination}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {truck ? (
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="font-semibold text-(--text) hover:text-(--primary)"
                        >
                          {
                            truck.registrationNumber
                          }
                        </Link>
                      ) : (
                        <span className="text-(--danger)">
                          Truck not found
                        </span>
                      )}

                      <p className="mt-1 text-xs text-(--text-muted)">
                        {driver?.name ??
                          "Driver not found"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-(--text)">
                        {(
                          trip.loadedWeightKg /
                          1000
                        ).toFixed(1)}{" "}
                        tons
                      </p>

                      <p className="mt-1 text-xs text-(--text-muted)">
                        {remainingCapacity.toLocaleString()}{" "}
                        kg remaining
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-28">
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="font-semibold text-(--text)">
                            {utilization}%
                          </span>

                          <span className="text-(--text-muted)">
                            {capacityKg / 1000}t
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              utilization > 100
                                ? "bg-(--danger)"
                                : utilization >=
                                    90
                                  ? "bg-(--warning)"
                                  : "bg-(--primary)"
                            }`}
                            style={{
                              width: `${Math.min(
                                utilization,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-(--text)">
                      PKR{" "}
                      {trip.tripAmount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[trip.status]}`}
                      >
                        {
                          statusLabels[
                            trip.status
                          ]
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="text-sm font-semibold text-(--primary) hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredTrips.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No trips found matching your
                    search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-(--border) px-4 py-4 sm:px-6">
          <p className="text-xs text-(--text-muted)">
            Showing {filteredTrips.length} of{" "}
            {trips.length} trips
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