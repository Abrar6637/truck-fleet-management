"use client";

import { trucks } from "@/data/trucks";
import {
  MaintenanceStatus,
  MaintenanceType,
} from "@/types/maintenance";
import {
  ArrowLeft,
  CalendarClock,
  Calculator,
  FileText,
  Gauge,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const maintenanceTypes: {
  value: MaintenanceType;
  label: string;
}[] = [
  { value: "oil_change", label: "Oil Change" },
  { value: "engine", label: "Engine" },
  { value: "brakes", label: "Brakes" },
  { value: "transmission", label: "Transmission" },
  { value: "electrical", label: "Electrical" },
  { value: "suspension", label: "Suspension" },
  { value: "body_work", label: "Body Work" },
  { value: "general_service", label: "General Service" },
  { value: "emergency_repair", label: "Emergency Repair" },
  { value: "other", label: "Other" },
];

const maintenanceStatuses: {
  value: MaintenanceStatus;
  label: string;
}[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AddMaintenancePage() {
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [maintenanceType, setMaintenanceType] =
    useState<MaintenanceType>("general_service");
  const [status, setStatus] =
    useState<MaintenanceStatus>("scheduled");

  const [labourCost, setLabourCost] = useState("");
  const [partsCost, setPartsCost] = useState("");
  const [otherCost, setOtherCost] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const truckId = Number(selectedTruckId);

  const selectedTruck = useMemo(
    () => trucks.find((truck) => truck.id === truckId),
    [truckId]
  );

  const labourCostNumber = Number(labourCost) || 0;
  const partsCostNumber = Number(partsCost) || 0;
  const otherCostNumber = Number(otherCost) || 0;

  const totalCost =
    labourCostNumber + partsCostNumber + otherCostNumber;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const serviceDate = String(
      formData.get("serviceDate") ?? ""
    );

    const workshopName = String(
      formData.get("workshopName") ?? ""
    ).trim();

    const description = String(
      formData.get("description") ?? ""
    ).trim();

    const odometerKm = Number(
      formData.get("odometerKm")
    );

    const nextServiceOdometerRaw = String(
      formData.get("nextServiceOdometerKm") ?? ""
    );

    const nextServiceOdometerKm =
      nextServiceOdometerRaw === ""
        ? undefined
        : Number(nextServiceOdometerRaw);

    if (!selectedTruck) {
      setError("Please select a truck.");
      return;
    }

    if (!serviceDate) {
      setError("Please select the service date.");
      return;
    }

    if (!workshopName) {
      setError("Please enter the workshop name.");
      return;
    }

    if (!description) {
      setError("Please enter the maintenance description.");
      return;
    }

    if (!Number.isFinite(odometerKm) || odometerKm < 0) {
      setError("Please enter a valid odometer reading.");
      return;
    }

    /*
     * For a new maintenance record, the odometer should not
     * move backwards from the truck's current reading.
     */
    if (odometerKm < selectedTruck.currentOdometerKm) {
      setError(
        `Odometer cannot be lower than the truck's current reading of ${selectedTruck.currentOdometerKm.toLocaleString()} km.`
      );
      return;
    }

    if (
      labourCostNumber < 0 ||
      partsCostNumber < 0 ||
      otherCostNumber < 0
    ) {
      setError("Maintenance costs cannot be negative.");
      return;
    }

    if (
      nextServiceOdometerKm !== undefined &&
      (!Number.isFinite(nextServiceOdometerKm) ||
        nextServiceOdometerKm <= odometerKm)
    ) {
      setError(
        "Next service odometer must be greater than the current service odometer."
      );
      return;
    }

    setSuccess(
      `Maintenance record is valid. Total estimated cost is PKR ${totalCost.toLocaleString()}. It will be saved when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/maintenance"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Maintenance
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Add Maintenance
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Schedule servicing or record a truck repair.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Truck */}
        <FormSection
          title="Truck Information"
          description="Select the truck requiring maintenance."
          icon={<Truck size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Truck" required>
              <select
                name="truckId"
                value={selectedTruckId}
                onChange={(event) => {
                  setSelectedTruckId(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                className={inputClass}
              >
                <option value="">Select truck</option>

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

            <Field label="Odometer (km)" required>
              <input
                type="number"
                name="odometerKm"
                min="0"
                placeholder={
                  selectedTruck
                    ? `Current: ${selectedTruck.currentOdometerKm.toLocaleString()}`
                    : "e.g. 150000"
                }
                className={inputClass}
              />
            </Field>
          </div>

          {selectedTruck && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">
                Selected Truck
              </p>

              <p className="mt-1 font-semibold text-(--text)">
                {selectedTruck.registrationNumber}
                {selectedTruck.truckNumber
                  ? ` — ${selectedTruck.truckNumber}`
                  : ""}
              </p>

              <p className="mt-1 text-sm text-(--text-muted)">
                {selectedTruck.manufacturer}{" "}
                {selectedTruck.model} • Current odometer:{" "}
                {selectedTruck.currentOdometerKm.toLocaleString()} km
              </p>
            </div>
          )}
        </FormSection>

        {/* Maintenance Details */}
        <FormSection
          title="Maintenance Details"
          description="Enter service type, workshop and current status."
          icon={<Wrench size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Maintenance Type" required>
              <select
                name="maintenanceType"
                value={maintenanceType}
                onChange={(event) =>
                  setMaintenanceType(
                    event.target.value as MaintenanceType
                  )
                }
                className={inputClass}
              >
                {maintenanceTypes.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" required>
              <select
                name="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as MaintenanceStatus
                  )
                }
                className={inputClass}
              >
                {maintenanceStatuses.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Service Date" required>
              <input
                type="date"
                name="serviceDate"
                className={inputClass}
              />
            </Field>

            <Field label="Workshop Name" required>
              <input
                type="text"
                name="workshopName"
                placeholder="e.g. Hino Lahore Service Center"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Description" required>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the service, repair or maintenance work..."
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Costs */}
        <FormSection
          title="Maintenance Cost"
          description="Enter the individual cost components."
          icon={<Calculator size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Labour Cost (PKR)">
              <input
                type="number"
                name="labourCost"
                min="0"
                step="0.01"
                value={labourCost}
                onChange={(event) =>
                  setLabourCost(event.target.value)
                }
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="Parts Cost (PKR)">
              <input
                type="number"
                name="partsCost"
                min="0"
                step="0.01"
                value={partsCost}
                onChange={(event) =>
                  setPartsCost(event.target.value)
                }
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="Other Cost (PKR)">
              <input
                type="number"
                name="otherCost"
                min="0"
                step="0.01"
                value={otherCost}
                onChange={(event) =>
                  setOtherCost(event.target.value)
                }
                placeholder="0"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5 rounded-xl border border-(--border) bg-slate-50 p-4">
            <p className="text-sm text-(--text-muted)">
              Total Maintenance Cost
            </p>

            <p className="mt-1 text-2xl font-bold text-(--text)">
              PKR {totalCost.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-(--text-muted)">
              Labour + Parts + Other
            </p>
          </div>
        </FormSection>

        {/* Next Service */}
        <FormSection
          title="Next Service"
          description="Optional reminders for future maintenance."
          icon={<CalendarClock size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Next Service Date">
              <input
                type="date"
                name="nextServiceDate"
                className={inputClass}
              />
            </Field>

            <Field label="Next Service Odometer (km)">
              <input
                type="number"
                name="nextServiceOdometerKm"
                min="0"
                placeholder="e.g. 190000"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Receipt */}
        <FormSection
          title="Receipt & Notes"
          description="Add optional workshop receipt and additional notes."
          icon={<FileText size={19} />}
        >
          <div className="space-y-5">
            <Field label="Receipt Number">
              <input
                type="text"
                name="receiptNumber"
                placeholder="e.g. HINO-1050"
                className={inputClass}
              />
            </Field>

            <Field label="Receipt Image">
              <input
                type="file"
                name="receiptImage"
                accept="image/*"
                className="block w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text-muted) file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-(--primary)"
              />
            </Field>

            <Field label="Notes">
              <textarea
                name="notes"
                rows={4}
                placeholder="Optional maintenance notes..."
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

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

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href="/admin/maintenance"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <Gauge size={17} />
            Save Maintenance
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";

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

      <div className="p-6">{children}</div>
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
          <span className="ml-1 text-(--danger)">*</span>
        )}
      </span>

      {children}
    </label>
  );
}