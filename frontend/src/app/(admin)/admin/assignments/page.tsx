"use client";

import { drivers } from "@/data/drivers";
import { truckAssignments } from "@/data/truckAssignments";
import { trucks } from "@/data/trucks";
import {
  ArrowRight,
  History,
  Link2,
  Plus,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";

export default function AssignmentsPage() {
  const activeAssignments = truckAssignments.filter(
    (assignment) => assignment.status === "active"
  );

  const completedAssignments = truckAssignments.filter(
    (assignment) => assignment.status === "completed"
  );

  const unassignedTrucks = trucks.filter(
    (truck) =>
      !activeAssignments.some(
        (assignment) =>
          assignment.truckId === truck.id
      )
  );

  const unassignedDrivers = drivers.filter(
    (driver) =>
      !activeAssignments.some(
        (assignment) =>
          assignment.driverId === driver.id
      )
  );

  const getTruck = (truckId: number) =>
    trucks.find((truck) => truck.id === truckId);

  const getDriver = (driverId: number) =>
    drivers.find(
      (driver) => driver.id === driverId
    );

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-(--text) sm:text-2xl">
            Truck Assignments
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage active truck and driver
            assignments and review assignment
            history.
          </p>
        </div>

        <Link
          href="/admin/assignments/add"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-auto"
        >
          <Plus size={18} />
          New Assignment
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Active Assignments"
          value={activeAssignments.length}
          icon={Link2}
        />

        <SummaryCard
          title="Unassigned Trucks"
          value={unassignedTrucks.length}
          icon={Truck}
        />

        <SummaryCard
          title="Unassigned Drivers"
          value={unassignedDrivers.length}
          icon={UserRound}
        />

        <SummaryCard
          title="Past Assignments"
          value={completedAssignments.length}
          icon={History}
        />
      </section>

      {/* Current Assignments */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-4 py-5 sm:px-6">
          <h3 className="font-semibold text-(--text)">
            Current Assignments
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            Drivers currently assigned to fleet
            trucks.
          </p>
        </div>

        {/* Mobile Current Assignments */}
        <div className="divide-y divide-(--border) md:hidden">
          {activeAssignments.map((assignment) => {
            const truck = getTruck(
              assignment.truckId
            );

            const driver = getDriver(
              assignment.driverId
            );

            return (
              <div
                key={assignment.id}
                className="p-4"
              >
                {/* Truck / Driver */}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                    <Truck size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    {truck ? (
                      <>
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="font-semibold text-(--primary)"
                        >
                          {
                            truck.registrationNumber
                          }
                        </Link>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {truck.manufacturer}{" "}
                          {truck.model}
                        </p>
                      </>
                    ) : (
                      <p className="font-medium text-(--danger)">
                        Truck not found
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-(--border)" />

                  <Link2
                    size={16}
                    className="text-(--text-muted)"
                  />

                  <div className="h-px flex-1 bg-(--border)" />
                </div>

                {/* Driver */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-(--text-muted)">
                    <UserRound size={18} />
                  </div>

                  <div className="min-w-0">
                    {driver ? (
                      <>
                        <Link
                          href={`/admin/drivers/${driver.id}`}
                          className="font-semibold text-(--text)"
                        >
                          {driver.name}
                        </Link>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {driver.phone}
                        </p>
                      </>
                    ) : (
                      <p className="font-medium text-(--danger)">
                        Driver not found
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3">
                  <MobileInfo
                    label="Assigned Date"
                    value={assignment.assignedAt}
                  />

                  <MobileInfo
                    label="Created By"
                    value={assignment.createdBy}
                  />
                </div>

                <button
                  type="button"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-(--danger) transition hover:bg-red-50"
                >
                  Unassign
                </button>
              </div>
            );
          })}

          {activeAssignments.length === 0 && (
            <EmptyState message="No active assignments found." />
          )}
        </div>

        {/* Desktop Current Assignments */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
                <th className="px-6 py-4">
                  Truck
                </th>
                <th className="px-6 py-4">
                  Driver
                </th>
                <th className="px-6 py-4">
                  Assigned Date
                </th>
                <th className="px-6 py-4">
                  Status
                </th>
                <th className="px-6 py-4">
                  Created By
                </th>
                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {activeAssignments.map(
                (assignment) => {
                  const truck = getTruck(
                    assignment.truckId
                  );

                  const driver = getDriver(
                    assignment.driverId
                  );

                  return (
                    <tr
                      key={assignment.id}
                      className="border-t border-(--border) text-sm transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        {truck ? (
                          <>
                            <Link
                              href={`/admin/trucks/${truck.id}`}
                              className="font-semibold text-(--primary) hover:underline"
                            >
                              {
                                truck.registrationNumber
                              }
                            </Link>

                            <p className="mt-1 text-xs text-(--text-muted)">
                              {
                                truck.manufacturer
                              }{" "}
                              {truck.model}
                            </p>
                          </>
                        ) : (
                          <span className="text-(--danger)">
                            Truck not found
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {driver ? (
                          <>
                            <Link
                              href={`/admin/drivers/${driver.id}`}
                              className="font-semibold text-(--text) hover:text-(--primary)"
                            >
                              {driver.name}
                            </Link>

                            <p className="mt-1 text-xs text-(--text-muted)">
                              {driver.phone}
                            </p>
                          </>
                        ) : (
                          <span className="text-(--danger)">
                            Driver not found
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-(--text)">
                        {assignment.assignedAt}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Active
                        </span>
                      </td>

                      <td className="px-6 py-4 text-(--text-muted)">
                        {assignment.createdBy}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="text-sm font-semibold text-(--danger) hover:underline"
                        >
                          Unassign
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}

              {activeAssignments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-(--text-muted)"
                  >
                    No active assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assignment History */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-4 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <History
              size={18}
              className="text-(--text-muted)"
            />

            <h3 className="font-semibold text-(--text)">
              Assignment History
            </h3>
          </div>

          <p className="mt-1 text-sm text-(--text-muted)">
            Previous truck and driver relationships.
          </p>
        </div>

        {/* Mobile History */}
        <div className="divide-y divide-(--border) md:hidden">
          {completedAssignments.map(
            (assignment) => {
              const truck = getTruck(
                assignment.truckId
              );

              const driver = getDriver(
                assignment.driverId
              );

              return (
                <div
                  key={assignment.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {truck ? (
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="font-semibold text-(--primary)"
                        >
                          {
                            truck.registrationNumber
                          }
                        </Link>
                      ) : (
                        <p className="font-semibold text-(--text)">
                          Unknown Truck
                        </p>
                      )}

                      <p className="mt-1 text-xs text-(--text-muted)">
                        Truck
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Completed
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                      Driver
                    </p>

                    {driver ? (
                      <Link
                        href={`/admin/drivers/${driver.id}`}
                        className="mt-1 inline-block text-sm font-semibold text-(--text)"
                      >
                        {driver.name}
                      </Link>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-(--text)">
                        Unknown
                      </p>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                      Assignment Period
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-(--text)">
                      <span>
                        {assignment.assignedAt}
                      </span>

                      <ArrowRight
                        size={15}
                        className="shrink-0 text-(--text-muted)"
                      />

                      <span>
                        {assignment.unassignedAt ??
                          "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          )}

          {completedAssignments.length === 0 && (
            <EmptyState message="No previous assignments found." />
          )}
        </div>

        {/* Desktop History */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
                <th className="px-6 py-4">
                  Truck
                </th>
                <th className="px-6 py-4">
                  Driver
                </th>
                <th className="px-6 py-4">
                  Assigned
                </th>
                <th className="px-6 py-4">
                  Unassigned
                </th>
                <th className="px-6 py-4">
                  Duration
                </th>
                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {completedAssignments.map(
                (assignment) => {
                  const truck = getTruck(
                    assignment.truckId
                  );

                  const driver = getDriver(
                    assignment.driverId
                  );

                  return (
                    <tr
                      key={assignment.id}
                      className="border-t border-(--border) text-sm transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
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
                          "Unknown"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {driver ? (
                          <Link
                            href={`/admin/drivers/${driver.id}`}
                            className="font-semibold text-(--text) hover:text-(--primary)"
                          >
                            {driver.name}
                          </Link>
                        ) : (
                          "Unknown"
                        )}
                      </td>

                      <td className="px-6 py-4 text-(--text)">
                        {assignment.assignedAt}
                      </td>

                      <td className="px-6 py-4 text-(--text)">
                        {assignment.unassignedAt ??
                          "—"}
                      </td>

                      <td className="px-6 py-4 text-(--text-muted)">
                        <div className="flex items-center gap-2">
                          {assignment.assignedAt}

                          <ArrowRight size={14} />

                          {assignment.unassignedAt ??
                            "—"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                }
              )}

              {completedAssignments.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-(--text-muted)"
                  >
                    No previous assignments found.
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

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="px-4 py-10 text-center">
      <Link2
        size={28}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm text-(--text-muted)">
        {message}
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