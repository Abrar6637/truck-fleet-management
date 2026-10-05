"use client";

import { odometerLogs } from "@/data/odometerLogs";
import { trucks } from "@/data/trucks";
import { OdometerSource } from "@/types/odometerLog";
import {
  Gauge,
  Search,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

type SourceFilter = "all" | OdometerSource;

export default function OdometerHistoryPage() {
  const [search, setSearch] = useState("");
  const [truckFilter, setTruckFilter] =
    useState("all");
  const [sourceFilter, setSourceFilter] =
    useState<SourceFilter>("all");

  const rows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return odometerLogs
      .map((log) => {
        const truck = trucks.find(
          (item) => item.id === log.truckId
        );

        return {
          ...log,
          truck,
        };
      })
      .filter((log) => {
        const matchesSearch =
          !query ||
          [
            log.truck?.registrationNumber ?? "",
            log.truck?.truckNumber ?? "",
            log.recordedBy,
            log.notes ?? "",
            log.source,
          ].some((value) =>
            value
              .toLowerCase()
              .includes(query)
          );

        const matchesTruck =
          truckFilter === "all" ||
          log.truckId === Number(truckFilter);

        const matchesSource =
          sourceFilter === "all" ||
          log.source === sourceFilter;

        return (
          matchesSearch &&
          matchesTruck &&
          matchesSource
        );
      })
      .sort((a, b) =>
        b.recordedAt.localeCompare(
          a.recordedAt
        )
      );
  }, [search, truckFilter, sourceFilter]);

  const latestReadings = useMemo(() => {
    const readings = new Map<
      number,
      number
    >();

    [...odometerLogs]
      .sort((a, b) =>
        b.recordedAt.localeCompare(
          a.recordedAt
        )
      )
      .forEach((log) => {
        if (!readings.has(log.truckId)) {
          readings.set(
            log.truckId,
            log.odometerKm
          );
        }
      });

    return readings;
  }, []);

  const trackedTrucks =
    latestReadings.size;

  const highestReading =
    odometerLogs.length > 0
      ? Math.max(
          ...odometerLogs.map(
            (log) => log.odometerKm
          )
        )
      : 0;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
          Odometer History
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Track truck mileage readings
          recorded from trips, fuel,
          maintenance and manual entries.
        </p>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <SummaryCard
          label="Total Readings"
          value={odometerLogs.length.toLocaleString()}
          icon={Gauge}
        />

        <SummaryCard
          label="Tracked Trucks"
          value={trackedTrucks.toLocaleString()}
          icon={Truck}
        />

        <SummaryCard
          label="Highest Reading"
          value={`${highestReading.toLocaleString()} km`}
          icon={Gauge}
        />
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
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
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Truck, driver, notes..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Truck */}
          <div>
            <label className={labelClass}>
              Truck
            </label>

            <select
              value={truckFilter}
              onChange={(event) =>
                setTruckFilter(
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Trucks
              </option>

              {trucks.map((truck) => (
                <option
                  key={truck.id}
                  value={truck.id}
                >
                  {truck.registrationNumber}
                  {truck.truckNumber
                    ? ` — ${truck.truckNumber}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className={labelClass}>
              Source
            </label>

            <select
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(
                  event.target
                    .value as SourceFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Sources
              </option>
              <option value="manual">
                Manual
              </option>
              <option value="trip_start">
                Trip Start
              </option>
              <option value="trip_end">
                Trip End
              </option>
              <option value="fuel">
                Fuel
              </option>
              <option value="maintenance">
                Maintenance
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-(--text)">
              Mileage Readings
            </h3>

            <p className="text-xs text-(--text-muted)">
              Showing {rows.length} of{" "}
              {odometerLogs.length} readings
            </p>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {rows.map((log) => {
            const isLatest =
              latestReadings.get(
                log.truckId
              ) === log.odometerKm;

            return (
              <div
                key={log.id}
                className="p-4"
              >
                {/* Truck / Source */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                      <Truck size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-words font-semibold text-(--text)">
                        {log.truck
                          ?.registrationNumber ??
                          "Unknown Truck"}
                      </p>

                      {log.truck
                        ?.truckNumber && (
                        <p className="mt-1 text-xs text-(--text-muted)">
                          {
                            log.truck
                              .truckNumber
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <SourceBadge
                    source={log.source}
                  />
                </div>

                {/* Odometer */}
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                        Odometer Reading
                      </p>

                      <p className="mt-1 text-xl font-bold text-(--text)">
                        {log.odometerKm.toLocaleString()}{" "}
                        km
                      </p>
                    </div>

                    {isLatest && (
                      <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Latest
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <MobileInfo
                    label="Date & Time"
                    value={formatDateTime(
                      log.recordedAt
                    )}
                  />

                  <MobileInfo
                    label="Recorded By"
                    value={log.recordedBy}
                  />

                  <MobileInfo
                    label="Related Record"
                    value={getRelatedRecord(
                      log
                    )}
                  />

                  <MobileInfo
                    label="Source"
                    value={formatLabel(
                      log.source
                    )}
                  />
                </div>

                {/* Notes */}
                <div className="mt-4 rounded-xl border border-(--border) p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Notes
                  </p>

                  <p className="mt-1 break-words text-sm leading-6 text-(--text)">
                    {log.notes ??
                      "No notes added."}
                  </p>
                </div>
              </div>
            );
          })}

          {rows.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[950px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-(--border)">
                <TableHeading>
                  Date & Time
                </TableHeading>

                <TableHeading>
                  Truck
                </TableHeading>

                <TableHeading>
                  Odometer
                </TableHeading>

                <TableHeading>
                  Source
                </TableHeading>

                <TableHeading>
                  Related Record
                </TableHeading>

                <TableHeading>
                  Recorded By
                </TableHeading>

                <TableHeading>
                  Notes
                </TableHeading>
              </tr>
            </thead>

            <tbody>
              {rows.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-(--border) last:border-b-0 hover:bg-slate-50/60"
                >
                  <TableCell>
                    <span className="whitespace-nowrap">
                      {formatDateTime(
                        log.recordedAt
                      )}
                    </span>
                  </TableCell>

                  <TableCell>
                    {log.truck ? (
                      <div>
                        <p className="font-semibold text-(--text)">
                          {
                            log.truck
                              .registrationNumber
                          }
                        </p>

                        {log.truck
                          .truckNumber && (
                          <p className="mt-1 text-xs text-(--text-muted)">
                            {
                              log.truck
                                .truckNumber
                            }
                          </p>
                        )}
                      </div>
                    ) : (
                      "Unknown Truck"
                    )}
                  </TableCell>

                  <TableCell>
                    <p className="font-semibold text-(--text)">
                      {log.odometerKm.toLocaleString()}{" "}
                      km
                    </p>

                    {latestReadings.get(
                      log.truckId
                    ) ===
                      log.odometerKm && (
                      <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        Latest
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <SourceBadge
                      source={log.source}
                    />
                  </TableCell>

                  <TableCell>
                    {getRelatedRecord(log)}
                  </TableCell>

                  <TableCell>
                    {log.recordedBy}
                  </TableCell>

                  <TableCell>
                    <p className="max-w-[280px]">
                      {log.notes ?? "—"}
                    </p>
                  </TableCell>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center"
                  >
                    <Gauge
                      size={30}
                      className="mx-auto text-(--text-muted)"
                    />

                    <p className="mt-3 text-sm font-medium text-(--text)">
                      No odometer readings
                      found.
                    </p>

                    <p className="mt-1 text-sm text-(--text-muted)">
                      Try changing the
                      selected filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-(--border) px-4 py-3 text-xs text-(--text-muted) sm:px-5">
          Showing {rows.length} of{" "}
          {odometerLogs.length} readings
        </div>
      </section>

      {/* Validation Rule */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-(--text)">
          Odometer Validation
        </p>

        <p className="mt-1 text-sm leading-6 text-(--text-muted)">
          When Laravel backend is connected,
          every new reading will be checked
          against that truck&apos;s latest
          odometer reading. A lower reading
          will be rejected to prevent
          inconsistent mileage history.
        </p>
      </section>
    </div>
  );
}

function SourceBadge({
  source,
}: {
  source: OdometerSource;
}) {
  const styles: Record<
    OdometerSource,
    string
  > = {
    manual:
      "bg-slate-100 text-slate-700",
    trip_start:
      "bg-blue-50 text-blue-700",
    trip_end:
      "bg-emerald-50 text-emerald-700",
    fuel:
      "bg-amber-50 text-amber-700",
    maintenance:
      "bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[source]}`}
    >
      {formatLabel(source)}
    </span>
  );
}

function getRelatedRecord(
  log: (typeof odometerLogs)[number]
) {
  if (log.tripId) {
    return `Trip #${log.tripId}`;
  }

  if (log.fuelEntryId) {
    return `Fuel #${log.fuelEntryId}`;
  }

  if (log.maintenanceRecordId) {
    return `Maintenance #${log.maintenanceRecordId}`;
  }

  return "—";
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Gauge;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-xs text-(--text-muted) sm:text-sm">
            {label}
          </p>

          <p className="mt-2 break-words text-xl font-bold text-(--text) sm:text-2xl">
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

function EmptyState() {
  return (
    <div className="px-4 py-10 text-center">
      <Gauge
        size={30}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm font-medium text-(--text)">
        No odometer readings found.
      </p>

      <p className="mt-1 text-sm text-(--text-muted)">
        Try changing the selected filters.
      </p>
    </div>
  );
}

function TableHeading({
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

function formatLabel(value: string) {
  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";