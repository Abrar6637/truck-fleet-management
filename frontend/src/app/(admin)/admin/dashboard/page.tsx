import StatCard from "@/components/ui/StatCard";
import {
  activeTrips,
  dashboardAlerts,
  dashboardStats,
  fleetStatus,
} from "@/data/dashboard";
import {
  AlertTriangle,
  CircleDollarSign,
  Route,
  Truck,
  UsersRound,
} from "lucide-react";

const formatPKR = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Introduction */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-(--text) sm:text-2xl">
          Fleet Overview
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-(--text-muted)">
          Monitor your fleet operations,
          active trips, and important alerts.
        </p>
      </div>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard
          title="Total Trucks"
          value={dashboardStats.totalTrucks}
          icon={Truck}
          subtitle="registered vehicles"
        />

        <StatCard
          title="Active Trips"
          value={dashboardStats.activeTrips}
          icon={Route}
          subtitle="currently running"
        />

        <StatCard
          title="Total Drivers"
          value={dashboardStats.totalDrivers}
          icon={UsersRound}
          subtitle="registered drivers"
        />

        <StatCard
          title="Monthly Revenue"
          value={formatPKR(
            dashboardStats.monthlyRevenue
          )}
          icon={CircleDollarSign}
          subtitle="current month"
        />
      </section>

      {/* Fleet Status + Alerts */}
      <section className="grid gap-5 xl:grid-cols-3 xl:gap-6">
        {/* Fleet Status */}
        <div className="rounded-2xl border border-(--border) bg-white p-4 sm:p-6 xl:col-span-2">
          <div className="mb-5 sm:mb-6">
            <h3 className="font-semibold text-(--text)">
              Fleet Status
            </h3>

            <p className="mt-1 text-sm leading-6 text-(--text-muted)">
              Current operational status of
              all trucks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {fleetStatus.map((status) => (
              <div
                key={status.label}
                className="min-w-0 rounded-xl border border-(--border) bg-slate-50 p-3 sm:p-4"
              >
                <p className="break-words text-xs font-medium text-(--text-muted)">
                  {status.label}
                </p>

                <p className="mt-2 text-xl font-bold text-(--text) sm:text-2xl">
                  {status.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-2xl border border-(--border) bg-white p-4 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-(--text)">
                Alerts
              </h3>

              <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                Items requiring attention.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={19} />
            </div>
          </div>

          <div className="space-y-4">
            {dashboardAlerts.map(
              (alert) => (
                <div
                  key={alert.id}
                  className="border-b border-(--border) pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        alert.type ===
                        "danger"
                          ? "bg-(--danger)"
                          : "bg-(--warning)"
                      }`}
                    />

                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-(--text)">
                        {alert.title}
                      </p>

                      <p className="mt-1 break-words text-xs leading-5 text-(--text-muted)">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Active Trips */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-(--text)">
                Active Trips
              </h3>

              <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                Current trips and truck load
                utilization.
              </p>
            </div>

            <p className="text-xs text-(--text-muted) sm:pt-1">
              {activeTrips.length} active{" "}
              {activeTrips.length === 1
                ? "trip"
                : "trips"}
            </p>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {activeTrips.map((trip) => {
            const utilization = Math.round(
              (trip.loadedWeightKg /
                trip.capacityKg) *
                100
            );

            const remainingCapacity =
              Math.max(
                trip.capacityKg -
                  trip.loadedWeightKg,
                0
              );

            return (
              <div
                key={trip.id}
                className="p-4"
              >
                {/* Trip + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                      Trip
                    </p>

                    <p className="mt-1 font-semibold text-(--primary)">
                      {trip.tripNumber}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-(--primary)">
                    {trip.status}
                  </span>
                </div>

                {/* Route */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Route
                  </p>

                  <p className="mt-1 break-words text-sm font-semibold text-(--text)">
                    {trip.origin} →{" "}
                    {trip.destination}
                  </p>
                </div>

                {/* Truck / Driver */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <MobileInfo
                    label="Truck"
                    value={trip.truck}
                  />

                  <MobileInfo
                    label="Driver"
                    value={trip.driver}
                  />
                </div>

                {/* Load Utilization */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-(--text)">
                      Load Utilization
                    </span>

                    <span className="font-semibold text-(--primary)">
                      {utilization}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-(--primary)"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            utilization,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-(--text-muted)">
                    <span>
                      Loaded:{" "}
                      {(
                        trip.loadedWeightKg /
                        1000
                      ).toFixed(1)}
                      t
                    </span>

                    <span>
                      Capacity:{" "}
                      {(
                        trip.capacityKg /
                        1000
                      ).toFixed(1)}
                      t
                    </span>
                  </div>

                  <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-(--primary)">
                    {(
                      remainingCapacity /
                      1000
                    ).toFixed(1)}
                    t remaining capacity
                  </div>
                </div>
              </div>
            );
          })}

          {activeTrips.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Route
                size={30}
                className="mx-auto text-(--text-muted)"
              />

              <p className="mt-3 text-sm font-medium text-(--text)">
                No active trips.
              </p>

              <p className="mt-1 text-sm text-(--text-muted)">
                Active fleet trips will
                appear here.
              </p>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
                <th className="px-6 py-4">
                  Trip
                </th>

                <th className="px-6 py-4">
                  Truck
                </th>

                <th className="px-6 py-4">
                  Driver
                </th>

                <th className="px-6 py-4">
                  Route
                </th>

                <th className="px-6 py-4">
                  Load
                </th>

                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {activeTrips.map((trip) => {
                const utilization =
                  Math.round(
                    (trip.loadedWeightKg /
                      trip.capacityKg) *
                      100
                  );

                const remainingCapacity =
                  Math.max(
                    trip.capacityKg -
                      trip.loadedWeightKg,
                    0
                  );

                return (
                  <tr
                    key={trip.id}
                    className="border-t border-(--border) text-sm"
                  >
                    <td className="px-6 py-4 font-semibold text-(--primary)">
                      {trip.tripNumber}
                    </td>

                    <td className="px-6 py-4 text-(--text)">
                      {trip.truck}
                    </td>

                    <td className="px-6 py-4 text-(--text)">
                      {trip.driver}
                    </td>

                    <td className="px-6 py-4 text-(--text-muted)">
                      {trip.origin} →{" "}
                      {trip.destination}
                    </td>

                    <td className="px-6 py-4">
                      <div className="min-w-[150px]">
                        <div className="mb-2 flex justify-between gap-3 text-xs">
                          <span className="font-medium text-(--text)">
                            {utilization}%
                          </span>

                          <span className="text-(--text-muted)">
                            {(
                              remainingCapacity /
                              1000
                            ).toFixed(1)}
                            t left
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-(--primary)"
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  utilization,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-(--primary)">
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {activeTrips.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No active trips.
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

      <p className="mt-1 break-words text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}