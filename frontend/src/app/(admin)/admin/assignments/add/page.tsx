"use client";

import Button from "@/components/ui/Button";
import { drivers } from "@/data/drivers";
import { truckAssignments } from "@/data/truckAssignments";
import { trucks } from "@/data/trucks";
import { ArrowLeft, Link2, Truck, UserRound } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AddAssignmentPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeAssignments = truckAssignments.filter(
    (assignment) => assignment.status === "active"
  );

  const eligibleTrucks = trucks.filter((truck) => {
    const alreadyAssigned = activeAssignments.some(
      (assignment) => assignment.truckId === truck.id
    );

    return truck.status === "available" && !alreadyAssigned;
  });

  const eligibleDrivers = drivers.filter((driver) => {
    const alreadyAssigned = activeAssignments.some(
      (assignment) => assignment.driverId === driver.id
    );

    return (
      driver.status === "available" &&
      driver.licenseVerificationStatus === "verified" &&
      !alreadyAssigned
    );
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const truckId = Number(formData.get("truckId"));
    const driverId = Number(formData.get("driverId"));
    const assignedAt = String(formData.get("assignedAt"));

    if (!truckId) {
      setError("Please select a truck.");
      return;
    }

    if (!driverId) {
      setError("Please select a driver.");
      return;
    }

    if (!assignedAt) {
      setError("Please select an assignment date.");
      return;
    }

    const truckIsEligible = eligibleTrucks.some(
      (truck) => truck.id === truckId
    );

    const driverIsEligible = eligibleDrivers.some(
      (driver) => driver.id === driverId
    );

    if (!truckIsEligible) {
      setError("The selected truck is not available for assignment.");
      return;
    }

    if (!driverIsEligible) {
      setError("The selected driver is not available for assignment.");
      return;
    }

    setSuccess(
      "Assignment information is valid. Saving will be enabled when the Laravel API is connected."
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/assignments"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Assignments
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
            <Link2 size={21} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-(--text)">
              New Assignment
            </h2>

            <p className="mt-1 text-sm text-(--text-muted)">
              Assign an available driver to an available truck.
            </p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-900">
          Assignment Rules
        </h3>

        <p className="mt-2 text-sm leading-6 text-blue-800">
          A truck and driver can only have one active assignment at a
          time. Only available trucks and drivers with a verified license
          can be assigned.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="mb-6 border-b border-(--border) pb-5">
            <h3 className="font-semibold text-(--text)">
              Assignment Details
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Select the truck, driver, and assignment date.
            </p>
          </div>

          <div className="space-y-6">
            {/* Truck */}
            <div>
              <label
                htmlFor="truckId"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Available Truck
              </label>

              <div className="relative">
                <Truck
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <select
                  id="truckId"
                  name="truckId"
                  defaultValue=""
                  required
                  className="w-full rounded-xl border border-(--border) bg-white py-3 pl-11 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select available truck
                  </option>

                  {eligibleTrucks.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      {truck.registrationNumber} —{" "}
                      {truck.manufacturer} {truck.model} —{" "}
                      {truck.capacityKg / 1000} tons
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-2 text-xs text-(--text-muted)">
                {eligibleTrucks.length} truck(s) currently eligible.
              </p>
            </div>

            {/* Driver */}
            <div>
              <label
                htmlFor="driverId"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Available Driver
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <select
                  id="driverId"
                  name="driverId"
                  defaultValue=""
                  required
                  className="w-full rounded-xl border border-(--border) bg-white py-3 pl-11 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select available driver
                  </option>

                  {eligibleDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} — {driver.licenseNumber}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-2 text-xs text-(--text-muted)">
                {eligibleDrivers.length} driver(s) currently eligible.
              </p>
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="assignedAt"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Assignment Date
              </label>

              <input
                id="assignedAt"
                name="assignedAt"
                type="date"
                required
                className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Optional assignment notes..."
                className="w-full resize-none rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {eligibleTrucks.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No eligible trucks are currently available for a new
            assignment.
          </div>
        )}

        {eligibleDrivers.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No eligible drivers are currently available for a new
            assignment.
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-(--danger)"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-(--success)"
          >
            {success}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/assignments"
            className="inline-flex items-center justify-center rounded-xl border border-(--border) bg-white px-5 py-3 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <Button
            type="submit"
            disabled={
              eligibleTrucks.length === 0 ||
              eligibleDrivers.length === 0
            }
          >
            Create Assignment
          </Button>
        </div>
      </form>
    </div>
  );
}