import { drivers } from "@/data/drivers";
import { trips } from "@/data/trips";
import { trucks } from "@/data/trucks";
import { TripStatus } from "@/types/trip";
import { tripStatusHistory } from "@/data/tripStatusHistory";
import TripStatusActions from "@/components/trips/TripStatusActions";

import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    MapPin,
    Package,
    Phone,
    Truck,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function TripDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const trip = trips.find(
        (item) => item.id === Number(id)
    );

    if (!trip) {
        notFound();
    }

    const truck = trucks.find(
        (item) => item.id === trip.truckId
    );

    const driver = drivers.find(
        (item) => item.id === trip.driverId
    );

    const capacityKg = truck?.capacityKg ?? 0;

    const remainingCapacity =
        capacityKg - trip.loadedWeightKg;

    const utilization =
        capacityKg > 0
            ? (trip.loadedWeightKg / capacityKg) * 100
            : 0;


    const statusHistory = tripStatusHistory
        .filter((history) => history.tripId === trip.id)
        .sort(
            (a, b) =>
                new Date(a.changedAt).getTime() -
                new Date(b.changedAt).getTime()
        );
    return (
        <div className="space-y-7">
            {/* Back */}
            <Link
                href="/admin/trips"
                className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
            >
                <ArrowLeft size={17} />
                Back to Trips
            </Link>

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold text-(--text)">
                            {trip.tripNumber}
                        </h2>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[trip.status]
                                }`}
                        >
                            {statusLabels[trip.status]}
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-(--text-muted)">
                        {trip.origin} → {trip.destination}
                    </p>
                </div>

                <div className="rounded-xl border border-(--border) bg-white px-5 py-3">
                    <p className="text-xs font-medium text-(--text-muted)">
                        Trip Amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-(--text)">
                        PKR {trip.tripAmount.toLocaleString()}
                    </p>
                </div>
            </div>
            {/* Status Actions */}
            <TripStatusActions currentStatus={trip.status} />
            {/* Journey */}
            <section className="rounded-2xl border border-(--border) bg-white p-6">
                <div className="mb-6">
                    <h3 className="font-semibold text-(--text)">
                        Trip Journey
                    </h3>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        Pickup and delivery information for this trip.
                    </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
                    {/* Pickup */}
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-(--primary)">
                                <Building2 size={19} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-(--primary)">
                                    Pickup
                                </p>

                                <h4 className="font-bold text-(--text)">
                                    {trip.pickupCompanyName}
                                </h4>
                            </div>
                        </div>

                        <CompanyDetail
                            icon={<UserRound size={16} />}
                            value={trip.pickupContactPerson}
                        />

                        <CompanyDetail
                            icon={<Phone size={16} />}
                            value={trip.pickupPhone}
                        />

                        <CompanyDetail
                            icon={<MapPin size={16} />}
                            value={trip.pickupAddress}
                        />
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-(--text-muted)">
                            →
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                <Building2 size={19} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                                    Delivery
                                </p>

                                <h4 className="font-bold text-(--text)">
                                    {trip.deliveryCompanyName}
                                </h4>
                            </div>
                        </div>

                        <CompanyDetail
                            icon={<UserRound size={16} />}
                            value={trip.deliveryContactPerson}
                        />

                        <CompanyDetail
                            icon={<Phone size={16} />}
                            value={trip.deliveryPhone}
                        />

                        <CompanyDetail
                            icon={<MapPin size={16} />}
                            value={trip.deliveryAddress}
                        />
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <OverviewCard
                    title="Truck"
                    value={truck?.registrationNumber ?? "Not Found"}
                    icon={<Truck size={20} />}
                />

                <OverviewCard
                    title="Driver"
                    value={driver?.name ?? "Not Found"}
                    icon={<UserRound size={20} />}
                />

                <OverviewCard
                    title="Loaded Weight"
                    value={`${trip.loadedWeightKg.toLocaleString()} kg`}
                    icon={<Package size={20} />}
                />

                <OverviewCard
                    title="Trip Amount"
                    value={`PKR ${trip.tripAmount.toLocaleString()}`}
                    icon={<CircleDollarSign size={20} />}
                />
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
                {/* Truck & Load */}
                <section className="rounded-2xl border border-(--border) bg-white p-6">
                    <h3 className="mb-6 font-semibold text-(--text)">
                        Truck & Load
                    </h3>

                    <div className="space-y-4">
                        <DetailRow
                            label="Truck"
                            value={
                                truck
                                    ? `${truck.registrationNumber} — ${truck.manufacturer} ${truck.model}`
                                    : "Truck not found"
                            }
                        />

                        <DetailRow
                            label="Driver"
                            value={driver?.name ?? "Driver not found"}
                        />

                        <DetailRow
                            label="Goods Type"
                            value={trip.goodsType}
                        />

                        <DetailRow
                            label="Loaded Weight"
                            value={`${trip.loadedWeightKg.toLocaleString()} kg`}
                        />

                        <DetailRow
                            label="Maximum Capacity"
                            value={
                                truck
                                    ? `${truck.capacityKg.toLocaleString()} kg`
                                    : "N/A"
                            }
                        />

                        <DetailRow
                            label="Remaining Capacity"
                            value={
                                truck
                                    ? `${remainingCapacity.toLocaleString()} kg`
                                    : "N/A"
                            }
                        />
                    </div>

                    {truck && (
                        <div className="mt-6 rounded-xl bg-slate-50 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-(--text)">
                                    Load Utilization
                                </span>

                                <span className="text-sm font-bold text-(--text)">
                                    {utilization.toFixed(1)}%
                                </span>
                            </div>

                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className={`h-full rounded-full ${utilization > 100
                                            ? "bg-(--danger)"
                                            : utilization >= 90
                                                ? "bg-(--warning)"
                                                : "bg-(--primary)"
                                        }`}
                                    style={{
                                        width: `${Math.min(utilization, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Schedule */}
                <section className="rounded-2xl border border-(--border) bg-white p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <CalendarDays
                            size={19}
                            className="text-(--primary)"
                        />

                        <h3 className="font-semibold text-(--text)">
                            Route & Schedule
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <DetailRow
                            label="Origin"
                            value={trip.origin}
                        />

                        <DetailRow
                            label="Destination"
                            value={trip.destination}
                        />

                        <DetailRow
                            label="Start Date"
                            value={trip.startDate}
                        />

                        <DetailRow
                            label="Expected Delivery"
                            value={trip.expectedDeliveryDate}
                        />

                        <DetailRow
                            label="Actual Delivery"
                            value={trip.actualDeliveryDate ?? "Not delivered yet"}
                        />

                        <DetailRow
                            label="Created By"
                            value={trip.createdBy}
                        />
                    </div>
                </section>
            </div>

            {/* Cargo Description */}
            {trip.goodsDescription && (
                <section className="rounded-2xl border border-(--border) bg-white p-6">
                    <h3 className="font-semibold text-(--text)">
                        Goods Description
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-(--text-muted)">
                        {trip.goodsDescription}
                    </p>
                </section>
            )}

            {/* Trip Status History */}
            <section className="rounded-2xl border border-(--border) bg-white p-6">
                <div className="mb-6">
                    <h3 className="font-semibold text-(--text)">
                        Trip Status History
                    </h3>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        Complete status timeline for this trip.
                    </p>
                </div>

                {statusHistory.length === 0 ? (
                    <p className="text-sm text-(--text-muted)">
                        No status history available.
                    </p>
                ) : (
                    <div>
                        {statusHistory.map((history, index) => {
                            const isLast = index === statusHistory.length - 1;

                            return (
                                <div
                                    key={history.id}
                                    className="relative flex gap-4"
                                >
                                    {/* Timeline Icon */}
                                    <div className="flex flex-col items-center">
                                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-(--primary)">
                                            <CheckCircle2 size={18} />
                                        </div>

                                        {!isLast && (
                                            <div className="min-h-16 w-px flex-1 bg-(--border)" />
                                        )}
                                    </div>

                                    {/* Timeline Content */}
                                    <div className={isLast ? "pb-0" : "pb-7"}>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[history.newStatus]
                                                    }`}
                                            >
                                                {statusLabels[history.newStatus]}
                                            </span>

                                            {history.oldStatus && (
                                                <span className="text-xs text-(--text-muted)">
                                                    from {statusLabels[history.oldStatus]}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-sm font-medium text-(--text)">
                                            {history.changedBy}
                                        </p>

                                        <p className="mt-1 text-xs text-(--text-muted)">
                                            {new Date(history.changedAt).toLocaleString(
                                                "en-PK",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </p>

                                        {history.notes && (
                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--text-muted)">
                                                {history.notes}
                                            </p>
                                        )}

                                        {history.latitude !== undefined &&
                                            history.longitude !== undefined && (
                                                <p className="mt-2 flex items-center gap-1 text-xs text-(--text-muted)">
                                                    <MapPin size={13} />
                                                    {history.latitude}, {history.longitude}
                                                </p>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Notes */}
            {trip.notes && (
                <section className="rounded-2xl border border-(--border) bg-white p-6">
                    <h3 className="font-semibold text-(--text)">
                        Trip Notes
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-(--text-muted)">
                        {trip.notes}
                    </p>
                </section>
            )}
        </div>
    );
}

function CompanyDetail({
    icon,
    value,
}: {
    icon: React.ReactNode;
    value?: string;
}) {
    return (
        <div className="mt-3 flex items-start gap-2 text-sm">
            <span className="mt-0.5 shrink-0 text-(--text-muted)">
                {icon}
            </span>

            <span className="text-(--text-muted)">
                {value || "Not provided"}
            </span>
        </div>
    );
}

function OverviewCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-(--border) bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-(--text-muted)">
                        {title}
                    </p>

                    <p className="mt-2 font-bold text-(--text)">
                        {value}
                    </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start justify-between gap-5 border-b border-(--border) pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-(--text-muted)">
                {label}
            </span>

            <span className="text-right text-sm font-semibold text-(--text)">
                {value}
            </span>
        </div>
    );
}