"use client";

import { drivers } from "@/data/drivers";
import { truckLocations } from "@/data/truckLocations";
import { trucks } from "@/data/trucks";
import { trips } from "@/data/trips";
import { TruckLocationStatus } from "@/types/truckLocation";
import {
  Clock3,
  Gauge,
  MapPin,
  Navigation,
  Search,
  Truck,
  UserRound,
  WifiOff,
} from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter =
  | "all"
  | TruckLocationStatus;

export default function LiveTrackingPage() {
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [
    selectedTruckId,
    setSelectedTruckId,
  ] = useState<number | null>(
    truckLocations[0]?.truckId ?? null
  );

  const trackingRows = useMemo(() => {
    return truckLocations.map(
      (location) => {
        const truck = trucks.find(
          (item) =>
            item.id === location.truckId
        );

        const driver = location.driverId
          ? drivers.find(
              (item) =>
                item.id ===
                location.driverId
            )
          : undefined;

        const trip = location.tripId
          ? trips.find(
              (item) =>
                item.id ===
                location.tripId
            )
          : undefined;

        return {
          ...location,
          truck,
          driver,
          trip,
        };
      }
    );
  }, []);

  const filteredRows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return trackingRows.filter((row) => {
      const matchesSearch =
        !query ||
        [
          row.truck
            ?.registrationNumber ?? "",
          row.truck?.truckNumber ?? "",
          row.driver?.name ?? "",
          row.trip?.tripNumber ?? "",
          row.address ?? "",
        ].some((value) =>
          value
            .toLowerCase()
            .includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        row.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    trackingRows,
    search,
    statusFilter,
  ]);

  const selectedRow =
    trackingRows.find(
      (row) =>
        row.truckId === selectedTruckId
    ) ?? null;

  const movingCount =
    trackingRows.filter(
      (row) => row.status === "moving"
    ).length;

  const stoppedCount =
    trackingRows.filter(
      (row) => row.status === "stopped"
    ).length;

  const offlineCount =
    trackingRows.filter(
      (row) => row.status === "offline"
    ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
          Live Tracking
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Monitor the latest available
          location and movement status of
          fleet trucks.
        </p>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          label="Tracked Trucks"
          value={trackingRows.length}
          icon={Truck}
        />

        <SummaryCard
          label="Moving"
          value={movingCount}
          icon={Navigation}
        />

        <SummaryCard
          label="Stopped"
          value={stoppedCount}
          icon={MapPin}
        />

        <SummaryCard
          label="Offline"
          value={offlineCount}
          icon={WifiOff}
        />
      </section>

      {/* Main Tracking Area */}
      <section className="grid gap-5 lg:gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Truck List */}
        <div className="overflow-hidden rounded-2xl border border-(--border) bg-white">
          {/* Filters */}
          <div className="border-b border-(--border) p-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
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
                  placeholder="Search truck or driver..."
                  className={`${inputClass} pl-10`}
                />
              </div>

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
                  All Tracking Statuses
                </option>

                <option value="moving">
                  Moving
                </option>

                <option value="stopped">
                  Stopped
                </option>

                <option value="offline">
                  Offline
                </option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[520px] overflow-y-auto xl:max-h-[610px]">
            {filteredRows.map((row) => {
              const selected =
                row.truckId ===
                selectedTruckId;

              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() =>
                    setSelectedTruckId(
                      row.truckId
                    )
                  }
                  className={`w-full border-b border-(--border) p-4 text-left transition last:border-b-0 ${
                    selected
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-(--text)">
                        {row.truck
                          ?.registrationNumber ??
                          "Unknown Truck"}
                      </p>

                      <p className="mt-1 text-xs text-(--text-muted)">
                        {row.truck
                          ?.truckNumber ??
                          "No truck number"}
                      </p>
                    </div>

                    <StatusBadge
                      status={row.status}
                    />
                  </div>

                  <div className="mt-3 space-y-2 text-xs text-(--text-muted)">
                    <p className="flex min-w-0 items-start gap-2">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0"
                      />

                      <span className="break-words">
                        {row.address ??
                          "Location unavailable"}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <UserRound
                        size={14}
                        className="shrink-0"
                      />

                      <span className="break-words">
                        {row.driver?.name ??
                          "No driver"}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <p className="flex items-center gap-2">
                        <Gauge
                          size={14}
                          className="shrink-0"
                        />

                        {row.speedKph} km/h
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock3
                          size={14}
                          className="shrink-0"
                        />

                        {formatDateTime(
                          row.recordedAt
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredRows.length ===
              0 && (
              <div className="px-5 py-10 text-center sm:py-12">
                <Truck
                  size={30}
                  className="mx-auto text-(--text-muted)"
                />

                <p className="mt-3 text-sm font-medium text-(--text)">
                  No tracked trucks found.
                </p>

                <p className="mt-1 text-sm text-(--text-muted)">
                  Try changing your search
                  or tracking status.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map + Selected Truck */}
        <div className="min-w-0 space-y-5">
          {/* Map Placeholder */}
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-(--border) bg-slate-100 sm:min-h-[360px] lg:min-h-[390px]">
            <div className="absolute inset-0 opacity-60">
              <div className="h-full w-full bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 text-center sm:px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-(--primary) shadow-sm sm:h-14 sm:w-14">
                <MapPin size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-(--text)">
                Live Map Integration
              </h3>

              <p className="mt-2 text-sm leading-6 text-(--text-muted)">
                This area is reserved for
                the real GPS map. Google
                Maps, Mapbox or another
                tracking provider can be
                connected after the backend
                and GPS source are
                configured.
              </p>

              {selectedRow && (
                <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-(--border) bg-white px-3 py-2 text-xs font-semibold text-(--text) sm:px-4">
                  <MapPin
                    size={14}
                    className="shrink-0 text-(--primary)"
                  />

                  <span className="break-all">
                    {selectedRow.latitude.toFixed(
                      4
                    )}
                    ,{" "}
                    {selectedRow.longitude.toFixed(
                      4
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Selected Truck Details */}
          {selectedRow ? (
            <div className="rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 border-b border-(--border) pb-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Selected Truck
                  </p>

                  <h3 className="mt-1 break-words text-lg font-bold text-(--text)">
                    {selectedRow.truck
                      ?.registrationNumber ??
                      "Unknown Truck"}
                  </h3>

                  {selectedRow.truck
                    ?.truckNumber && (
                    <p className="mt-1 text-xs text-(--text-muted)">
                      {
                        selectedRow.truck
                          .truckNumber
                      }
                    </p>
                  )}
                </div>

                <StatusBadge
                  status={
                    selectedRow.status
                  }
                />
              </div>

              {/* Main Details */}
              <div className="mt-5 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
                <InfoItem
                  label="Driver"
                  value={
                    selectedRow.driver
                      ?.name ??
                    "Not Assigned"
                  }
                  icon={UserRound}
                />

                <InfoItem
                  label="Active Trip"
                  value={
                    selectedRow.trip
                      ?.tripNumber ??
                    "No Active Trip"
                  }
                  icon={Navigation}
                />

                <InfoItem
                  label="Speed"
                  value={`${selectedRow.speedKph} km/h`}
                  icon={Gauge}
                />

                <InfoItem
                  label="Location"
                  value={
                    selectedRow.address ??
                    "Unavailable"
                  }
                  icon={MapPin}
                />

                <InfoItem
                  label="Heading"
                  value={
                    selectedRow.heading !==
                    undefined
                      ? `${selectedRow.heading}°`
                      : "—"
                  }
                  icon={Navigation}
                />

                <InfoItem
                  label="Last GPS Update"
                  value={formatDateTime(
                    selectedRow.recordedAt
                  )}
                  icon={Clock3}
                />
              </div>

              {/* Current Route */}
              {selectedRow.trip && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-(--primary)">
                      <Navigation
                        size={17}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                        Current Route
                      </p>

                      <p className="mt-1.5 break-words text-sm font-semibold text-(--text)">
                        {
                          selectedRow.trip
                            .origin
                        }{" "}
                        →{" "}
                        {
                          selectedRow.trip
                            .destination
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Coordinates */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <CoordinateItem
                  label="Latitude"
                  value={selectedRow.latitude.toFixed(
                    6
                  )}
                />

                <CoordinateItem
                  label="Longitude"
                  value={selectedRow.longitude.toFixed(
                    6
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-(--border) bg-white p-8 text-center">
              <Truck
                size={30}
                className="mx-auto text-(--text-muted)"
              />

              <p className="mt-3 text-sm text-(--text-muted)">
                Select a truck to view its
                tracking details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Notice */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-(--text)">
          Mock Tracking Data
        </p>

        <p className="mt-1 text-sm leading-6 text-(--text-muted)">
          These locations are frontend demo
          records, not live truck GPS
          positions. Real-time tracking will
          require a GPS source and backend
          integration.
        </p>
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: TruckLocationStatus;
}) {
  const styles: Record<
    TruckLocationStatus,
    string
  > = {
    moving:
      "bg-green-50 text-green-700",
    stopped:
      "bg-amber-50 text-amber-700",
    offline:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {formatLabel(status)}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Truck;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-xs text-(--text-muted) sm:text-sm">
            {label}
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

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Truck;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className="shrink-0 text-(--text-muted)"
        />

        <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
          {label}
        </p>
      </div>

      <p className="mt-1.5 break-words text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}

function CoordinateItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-(--border) p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
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

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";