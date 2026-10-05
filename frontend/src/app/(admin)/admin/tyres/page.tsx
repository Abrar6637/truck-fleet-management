"use client";

import { tyreAssignments } from "@/data/tyreAssignments";
import { tyres } from "@/data/tyres";
import { trucks } from "@/data/trucks";
import {
  TyreCondition,
  TyrePosition,
  TyreStatus,
} from "@/types/tyre";
import {
  CircleGauge,
  CirclePlus,
  PackageCheck,
  Search,
  ShieldAlert,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusLabels: Record<TyreStatus, string> = {
  in_stock: "In Stock",
  installed: "Installed",
  under_repair: "Under Repair",
  retired: "Retired",
};

const statusClasses: Record<TyreStatus, string> = {
  in_stock: "bg-green-50 text-green-700",
  installed: "bg-blue-50 text-blue-700",
  under_repair: "bg-amber-50 text-amber-700",
  retired: "bg-slate-100 text-slate-700",
};

const conditionLabels: Record<TyreCondition, string> = {
  new: "New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
  damaged: "Damaged",
};

const conditionClasses: Record<TyreCondition, string> = {
  new: "bg-green-50 text-green-700",
  good: "bg-blue-50 text-blue-700",
  fair: "bg-amber-50 text-amber-700",
  poor: "bg-orange-50 text-orange-700",
  damaged: "bg-red-50 text-red-700",
};

const positionLabels: Record<TyrePosition, string> = {
  front_left: "Front Left",
  front_right: "Front Right",
  rear_left_inner: "Rear Left Inner",
  rear_left_outer: "Rear Left Outer",
  rear_right_inner: "Rear Right Inner",
  rear_right_outer: "Rear Right Outer",
  spare: "Spare",
};

export default function TyresPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TyreStatus | "all">("all");

  const filteredTyres = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tyres.filter((tyre) => {
      const activeAssignment = tyreAssignments.find(
        (assignment) =>
          assignment.tyreId === tyre.id &&
          assignment.status === "active"
      );

      const truck = activeAssignment
        ? trucks.find(
            (item) => item.id === activeAssignment.truckId
          )
        : undefined;

      const matchesStatus =
        statusFilter === "all" ||
        tyre.status === statusFilter;

      const matchesSearch =
        !query ||
        [
          tyre.tyreNumber,
          tyre.brand,
          tyre.model,
          tyre.size,
          tyre.serialNumber,
          tyre.supplierName,
          statusLabels[tyre.status],
          conditionLabels[tyre.condition],
          truck?.registrationNumber,
          truck?.truckNumber,
          activeAssignment
            ? positionLabels[activeAssignment.position]
            : undefined,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const installedCount = tyres.filter(
    (tyre) => tyre.status === "installed"
  ).length;

  const inStockCount = tyres.filter(
    (tyre) => tyre.status === "in_stock"
  ).length;

  const attentionCount = tyres.filter(
    (tyre) =>
      tyre.status === "under_repair" ||
      tyre.condition === "poor" ||
      tyre.condition === "damaged"
  ).length;

  const tyreInvestment = tyres.reduce(
    (sum, tyre) => sum + tyre.purchasePrice,
    0
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-(--text)">
            Tyres
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage tyre inventory, condition, mileage and truck
            installation history.
          </p>
        </div>

        <Link
          href="/admin/tyres/add"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
        >
          <CirclePlus size={17} />
          Add Tyre
        </Link>
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Installed"
          value={String(installedCount)}
          subtitle="Currently on trucks"
          icon={Truck}
        />

        <SummaryCard
          title="In Stock"
          value={String(inStockCount)}
          subtitle="Available tyres"
          icon={PackageCheck}
        />

        <SummaryCard
          title="Needs Attention"
          value={String(attentionCount)}
          subtitle="Poor, damaged or repair"
          icon={ShieldAlert}
        />

        <SummaryCard
          title="Tyre Investment"
          value={`PKR ${tyreInvestment.toLocaleString()}`}
          subtitle="Total purchase value"
          icon={CircleGauge}
        />
      </section>

      {/* Tyre Inventory */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-(--border) p-5 xl:flex-row xl:items-center">
          <div>
            <h3 className="font-semibold text-(--text)">
              Tyre Inventory
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              {filteredTyres.length} tyre
              {filteredTyres.length === 1 ? "" : "s"} found.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <div className="relative w-full xl:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tyres..."
                className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as TyreStatus | "all"
                )
              }
              className="rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--primary)"
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="installed">Installed</option>
              <option value="under_repair">
                Under Repair
              </option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Tyre</TableHead>
                <TableHead>Brand / Size</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Life Used</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchase Price</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredTyres.map((tyre) => {
                const activeAssignment = tyreAssignments.find(
                  (assignment) =>
                    assignment.tyreId === tyre.id &&
                    assignment.status === "active"
                );

                const truck = activeAssignment
                  ? trucks.find(
                      (item) =>
                        item.id === activeAssignment.truckId
                    )
                  : undefined;

                const lifePercentage =
                  tyre.expectedLifeKm &&
                  tyre.expectedLifeKm > 0
                    ? (tyre.currentMileageKm /
                        tyre.expectedLifeKm) *
                      100
                    : 0;

                const displayedLifePercentage = Math.min(
                  lifePercentage,
                  100
                );

                return (
                  <tr
                    key={tyre.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <p className="font-semibold text-(--text)">
                        {tyre.tyreNumber}
                      </p>

                      <p className="mt-1 text-xs text-(--text-muted)">
                        {tyre.serialNumber ?? "No serial number"}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium text-(--text)">
                        {tyre.brand}
                        {tyre.model
                          ? ` ${tyre.model}`
                          : ""}
                      </p>

                      <p className="mt-1 text-xs text-(--text-muted)">
                        {tyre.size}
                      </p>
                    </TableCell>

                    <TableCell>
                      {truck ? (
                        <>
                          <Link
                            href={`/admin/trucks/${truck.id}`}
                            className="font-semibold text-(--text) hover:text-(--primary)"
                          >
                            {truck.registrationNumber}
                          </Link>

                          {truck.truckNumber && (
                            <p className="mt-1 text-xs text-(--text-muted)">
                              {truck.truckNumber}
                            </p>
                          )}
                        </>
                      ) : (
                        <span>—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {activeAssignment
                        ? positionLabels[
                            activeAssignment.position
                          ]
                        : "Not Installed"}
                    </TableCell>

                    <TableCell>
                      <p className="font-medium text-(--text)">
                        {tyre.currentMileageKm.toLocaleString()} km
                      </p>

                      {tyre.expectedLifeKm && (
                        <p className="mt-1 text-xs text-(--text-muted)">
                          Expected{" "}
                          {tyre.expectedLifeKm.toLocaleString()} km
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      {tyre.expectedLifeKm ? (
                        <div className="w-32">
                          <div className="mb-1 flex justify-between text-xs">
                            <span>
                              {lifePercentage.toFixed(1)}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                lifePercentage >= 100
                                  ? "bg-red-500"
                                  : lifePercentage >= 80
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${displayedLifePercentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          conditionClasses[tyre.condition]
                        }`}
                      >
                        {conditionLabels[tyre.condition]}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusClasses[tyre.status]
                        }`}
                      >
                        {statusLabels[tyre.status]}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-(--text)">
                        PKR {tyre.purchasePrice.toLocaleString()}
                      </span>
                    </TableCell>
                  </tr>
                );
              })}

              {filteredTyres.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No tyres found.
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

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Truck;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--text-muted)">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-(--text)">
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