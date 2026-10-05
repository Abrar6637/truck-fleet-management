import { trips } from "@/data/trips";
import { trucks } from "@/data/trucks";
import { calculateCapacity } from "@/lib/capacity";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Gauge,
  Package,
  Truck,
  UserRound,
  Weight,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TruckDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TruckDetailsPage({
  params,
}: TruckDetailsPageProps) {
  const { id } = await params;

  const truck = trucks.find(
    (item) => item.id === Number(id)
  );

  if (!truck) {
    notFound();
  }

  /*
   * Current physical load:
   * Only started / in_transit trips count.
   *
   * "assigned" is an upcoming trip, so its load is not
   * considered physically loaded on the truck yet.
   */
  const activePhysicalTrip = trips.find(
    (trip) =>
      trip.truckId === truck.id &&
      ["started", "in_transit"].includes(trip.status)
  );

  const currentLoadKg =
    activePhysicalTrip?.loadedWeightKg ?? 0;

  const capacity = calculateCapacity(
    truck.capacityKg,
    currentLoadKg
  );

  const statusLabels = {
    available: "Available",
    assigned: "Assigned",
    on_trip: "On Trip",
    maintenance: "Maintenance",
    breakdown: "Breakdown",
    inactive: "Inactive",
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/trucks"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Trucks
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
              <Truck size={23} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-(--text)">
                {truck.registrationNumber}
              </h2>

              <p className="mt-1 text-sm text-(--text-muted)">
                {truck.truckNumber ?? "No fleet number"} •{" "}
                {truck.manufacturer} {truck.model}
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-(--primary)">
            {statusLabels[truck.status]}
          </span>
        </div>
      </div>

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          label="Capacity"
          value={`${truck.capacityKg / 1000} tons`}
          icon={Package}
        />

        <InfoCard
          label="Odometer"
          value={`${truck.currentOdometerKm.toLocaleString()} km`}
          icon={Gauge}
        />

        <InfoCard
          label="Assigned Driver"
          value={truck.assignedDriver ?? "Unassigned"}
          icon={UserRound}
        />

        <InfoCard
          label="Model Year"
          value={String(truck.modelYear)}
          icon={CalendarDays}
        />
      </section>

      {/* Load & Capacity Status */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
              <Weight size={19} />
            </div>

            <div>
              <h3 className="font-semibold text-(--text)">
                Load & Capacity Status
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                Current physical load based on the truck&apos;s
                active trip.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CapacityCard
              label="Maximum Capacity"
              value={`${capacity.maximumCapacityKg.toLocaleString()} kg`}
            />

            <CapacityCard
              label="Current Load"
              value={`${capacity.loadedWeightKg.toLocaleString()} kg`}
            />

            <CapacityCard
              label="Remaining Capacity"
              value={`${capacity.remainingCapacityKg.toLocaleString()} kg`}
              danger={capacity.remainingCapacityKg < 0}
            />

            <CapacityCard
              label="Utilization"
              value={`${capacity.utilizationPercentage.toFixed(1)}%`}
              danger={capacity.isOverloaded}
            />
          </div>

          {/* Progress */}
          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-(--text)">
                  Load Utilization
                </p>

                <p className="mt-1 text-xs text-(--text-muted)">
                  {capacity.loadedWeightKg.toLocaleString()} kg of{" "}
                  {capacity.maximumCapacityKg.toLocaleString()} kg
                </p>
              </div>

              <span
                className={`text-sm font-bold ${
                  capacity.isOverloaded
                    ? "text-(--danger)"
                    : capacity.utilizationPercentage >= 90
                      ? "text-(--warning)"
                      : "text-(--primary)"
                }`}
              >
                {capacity.utilizationPercentage.toFixed(1)}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  capacity.isOverloaded
                    ? "bg-(--danger)"
                    : capacity.utilizationPercentage >= 90
                      ? "bg-(--warning)"
                      : "bg-(--primary)"
                }`}
                style={{
                  width: `${Math.min(
                    capacity.utilizationPercentage,
                    100
                  )}%`,
                }}
              />
            </div>

            {!activePhysicalTrip && (
              <p className="mt-3 text-xs text-(--text-muted)">
                No active physical trip. Current load is 0 kg.
              </p>
            )}

            {activePhysicalTrip && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-(--border) pt-4">
                <div>
                  <p className="text-xs text-(--text-muted)">
                    Active Trip
                  </p>

                  <p className="mt-1 text-sm font-semibold text-(--text)">
                    {activePhysicalTrip.tripNumber} •{" "}
                    {activePhysicalTrip.origin} →{" "}
                    {activePhysicalTrip.destination}
                  </p>
                </div>

                <Link
                  href={`/admin/trips/${activePhysicalTrip.id}`}
                  className="text-sm font-semibold text-(--primary) hover:underline"
                >
                  View Trip
                </Link>
              </div>
            )}
          </div>

          {/* Overload Warning */}
          {capacity.isOverloaded && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-(--danger)"
              />

              <div>
                <p className="text-sm font-semibold text-(--danger)">
                  Truck is overloaded
                </p>

                <p className="mt-1 text-sm text-red-700">
                  Current load exceeds the maximum truck capacity by{" "}
                  {Math.abs(
                    capacity.remainingCapacityKg
                  ).toLocaleString()}{" "}
                  kg.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vehicle Information */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-6 py-5">
          <h3 className="font-semibold text-(--text)">
            Vehicle Information
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            Identification and purchase details for this truck.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-6 p-6 md:grid-cols-2 xl:grid-cols-3">
          <Detail
            label="Registration Number"
            value={truck.registrationNumber}
          />

          <Detail
            label="Fleet Number"
            value={truck.truckNumber ?? "—"}
          />

          <Detail
            label="Truck Type"
            value={truck.truckType}
          />

          <Detail
            label="Manufacturer"
            value={truck.manufacturer}
          />

          <Detail
            label="Model"
            value={truck.model}
          />

          <Detail
            label="Engine Number"
            value={truck.engineNumber}
          />

          <Detail
            label="Chassis Number"
            value={truck.chassisNumber}
          />

          <Detail
            label="Purchase Date"
            value={truck.purchaseDate}
          />

          <Detail
            label="Purchase Price"
            value={`PKR ${truck.purchasePrice.toLocaleString()}`}
          />
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-2xl border border-(--border) bg-white p-6">
        <h3 className="font-semibold text-(--text)">
          Notes
        </h3>

        <p className="mt-3 text-sm leading-6 text-(--text-muted)">
          {truck.notes || "No notes have been added for this truck."}
        </p>
      </section>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Truck;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted)">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-(--text)">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function CapacityCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-(--border) p-4">
      <p className="text-xs font-medium text-(--text-muted)">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-bold ${
          danger ? "text-(--danger)" : "text-(--text)"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}