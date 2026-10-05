"use client";

import { tyreAssignments } from "@/data/tyreAssignments";
import { tyres } from "@/data/tyres";
import { trucks } from "@/data/trucks";
import { TyrePosition } from "@/types/tyre";
import {
  ArrowLeft,
  CalendarDays,
  CircleGauge,
  Gauge,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const tyrePositions: {
  value: TyrePosition;
  label: string;
}[] = [
  { value: "front_left", label: "Front Left" },
  { value: "front_right", label: "Front Right" },
  { value: "rear_left_inner", label: "Rear Left Inner" },
  { value: "rear_left_outer", label: "Rear Left Outer" },
  { value: "rear_right_inner", label: "Rear Right Inner" },
  { value: "rear_right_outer", label: "Rear Right Outer" },
  { value: "spare", label: "Spare" },
];

export default function InstallTyrePage() {
  const [selectedTruckId, setSelectedTruckId] =
    useState("");

  const [selectedTyreId, setSelectedTyreId] =
    useState("");

  const [position, setPosition] =
    useState<TyrePosition | "">("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const truckId = Number(selectedTruckId);
  const tyreId = Number(selectedTyreId);

  const selectedTruck = useMemo(
    () => trucks.find((truck) => truck.id === truckId),
    [truckId]
  );

  const selectedTyre = useMemo(
    () => tyres.find((tyre) => tyre.id === tyreId),
    [tyreId]
  );

  /*
   * Only tyres that are not currently installed
   * can be selected.
   */
  const availableTyres = useMemo(() => {
    return tyres.filter((tyre) => {
      const hasActiveAssignment = tyreAssignments.some(
        (assignment) =>
          assignment.tyreId === tyre.id &&
          assignment.status === "active"
      );

      return (
        !hasActiveAssignment &&
        tyre.status === "in_stock"
      );
    });
  }, []);

  /*
   * Positions already occupied on selected truck.
   */
  const occupiedPositions = useMemo(() => {
    if (!truckId) {
      return [];
    }

    return tyreAssignments
      .filter(
        (assignment) =>
          assignment.truckId === truckId &&
          assignment.status === "active"
      )
      .map((assignment) => assignment.position);
  }, [truckId]);

  const availablePositions = useMemo(() => {
    return tyrePositions.filter(
      (item) =>
        !occupiedPositions.includes(item.value)
    );
  }, [occupiedPositions]);

  const handleTruckChange = (
    value: string
  ) => {
    setSelectedTruckId(value);
    setPosition("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(
      event.currentTarget
    );

    const installedAt = String(
      formData.get("installedAt") ?? ""
    );

    const installedOdometerKm = Number(
      formData.get("installedOdometerKm")
    );

    if (!selectedTruck) {
      setError("Please select a truck.");
      return;
    }

    if (!selectedTyre) {
      setError("Please select a tyre.");
      return;
    }

    if (!position) {
      setError("Please select a tyre position.");
      return;
    }

    if (!installedAt) {
      setError(
        "Please select the installation date."
      );
      return;
    }

    if (
      !Number.isFinite(installedOdometerKm) ||
      installedOdometerKm < 0
    ) {
      setError(
        "Please enter a valid installation odometer."
      );
      return;
    }

    if (
      installedOdometerKm <
      selectedTruck.currentOdometerKm
    ) {
      setError(
        `Installation odometer cannot be lower than the truck's current odometer of ${selectedTruck.currentOdometerKm.toLocaleString()} km.`
      );
      return;
    }

    const tyreAlreadyInstalled =
      tyreAssignments.some(
        (assignment) =>
          assignment.tyreId === selectedTyre.id &&
          assignment.status === "active"
      );

    if (tyreAlreadyInstalled) {
      setError(
        "This tyre already has an active truck assignment."
      );
      return;
    }

    const positionAlreadyOccupied =
      tyreAssignments.some(
        (assignment) =>
          assignment.truckId ===
            selectedTruck.id &&
          assignment.position === position &&
          assignment.status === "active"
      );

    if (positionAlreadyOccupied) {
      setError(
        "This truck position already has an active tyre."
      );
      return;
    }

    setSuccess(
      `${selectedTyre.tyreNumber} is ready to install on ${selectedTruck.registrationNumber} at ${getPositionLabel(position)}. This assignment will be saved when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/tyres"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Tyres
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Install Tyre
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Assign an available tyre to a specific
          position on a fleet truck.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Truck */}
        <FormSection
          title="Select Truck"
          description="Choose the truck where the tyre will be installed."
          icon={<Truck size={19} />}
        >
          <Field label="Truck" required>
            <select
              name="truckId"
              value={selectedTruckId}
              onChange={(event) =>
                handleTruckChange(
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                Select truck
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
          </Field>

          {selectedTruck && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="font-semibold text-(--text)">
                {selectedTruck.registrationNumber}
                {selectedTruck.truckNumber
                  ? ` — ${selectedTruck.truckNumber}`
                  : ""}
              </p>

              <p className="mt-1 text-sm text-(--text-muted)">
                {selectedTruck.manufacturer}{" "}
                {selectedTruck.model}
              </p>

              <p className="mt-1 text-sm text-(--text-muted)">
                Current odometer:{" "}
                {selectedTruck.currentOdometerKm.toLocaleString()}{" "}
                km
              </p>
            </div>
          )}
        </FormSection>

        {/* Tyre */}
        <FormSection
          title="Select Tyre"
          description="Only tyres currently available in stock can be installed."
          icon={<CircleGauge size={19} />}
        >
          <Field label="Available Tyre" required>
            <select
              name="tyreId"
              value={selectedTyreId}
              onChange={(event) => {
                setSelectedTyreId(
                  event.target.value
                );
                setError("");
                setSuccess("");
              }}
              className={inputClass}
            >
              <option value="">
                Select tyre
              </option>

              {availableTyres.map((tyre) => (
                <option
                  key={tyre.id}
                  value={tyre.id}
                >
                  {tyre.tyreNumber} —{" "}
                  {tyre.brand} {tyre.size}
                </option>
              ))}
            </select>
          </Field>

          {selectedTyre && (
            <div className="mt-5 grid gap-4 rounded-xl border border-(--border) bg-slate-50 p-4 sm:grid-cols-3">
              <Info
                label="Brand"
                value={`${selectedTyre.brand}${
                  selectedTyre.model
                    ? ` ${selectedTyre.model}`
                    : ""
                }`}
              />

              <Info
                label="Size"
                value={selectedTyre.size}
              />

              <Info
                label="Mileage"
                value={`${selectedTyre.currentMileageKm.toLocaleString()} km`}
              />
            </div>
          )}
        </FormSection>

        {/* Position */}
        <FormSection
          title="Installation"
          description="Select the truck position and record installation information."
          icon={<Wrench size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Tyre Position"
              required
            >
              <select
                name="position"
                value={position}
                disabled={!selectedTruck}
                onChange={(event) =>
                  setPosition(
                    event.target
                      .value as TyrePosition
                  )
                }
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
              >
                <option value="">
                  Select position
                </option>

                {availablePositions.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="Installation Date"
              required
            >
              <input
                type="date"
                name="installedAt"
                className={inputClass}
              />
            </Field>

            <Field
              label="Installation Odometer (km)"
              required
            >
              <input
                type="number"
                name="installedOdometerKm"
                min="0"
                placeholder={
                  selectedTruck
                    ? `Current: ${selectedTruck.currentOdometerKm.toLocaleString()}`
                    : "Select truck first"
                }
                className={inputClass}
              />
            </Field>
          </div>

          {selectedTruck &&
            occupiedPositions.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-(--text)">
                  Currently Occupied Positions
                </p>

                <div className="flex flex-wrap gap-2">
                  {occupiedPositions.map(
                    (occupiedPosition) => (
                      <span
                        key={occupiedPosition}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-(--text-muted)"
                      >
                        {getPositionLabel(
                          occupiedPosition
                        )}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </FormSection>

        {/* Summary */}
        {selectedTruck &&
          selectedTyre &&
          position && (
            <section className="rounded-2xl border border-(--border) bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                  <Gauge size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-(--text)">
                    Installation Summary
                  </h3>

                  <p className="text-sm text-(--text-muted)">
                    Review the selected tyre
                    assignment.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Info
                  label="Truck"
                  value={
                    selectedTruck.registrationNumber
                  }
                />

                <Info
                  label="Tyre"
                  value={
                    selectedTyre.tyreNumber
                  }
                />

                <Info
                  label="Position"
                  value={getPositionLabel(
                    position
                  )}
                />
              </div>
            </section>
          )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-(--danger)">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href="/admin/tyres"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <Wrench size={17} />
            Install Tyre
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";

function getPositionLabel(
  position: TyrePosition
) {
  return (
    tyrePositions.find(
      (item) => item.value === position
    )?.label ?? position
  );
}

function Info({
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

      <p className="mt-1 font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}

function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-(--border) bg-white">
      <div className="flex items-start gap-3 border-b border-(--border) px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-(--text)">
            {title}
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-(--text)">
        {label}

        {required && (
          <span className="ml-1 text-(--danger)">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}