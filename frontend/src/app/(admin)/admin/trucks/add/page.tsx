"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AddTruckPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const capacityKg = Number(formData.get("capacityKg"));
    const odometerKm = Number(formData.get("currentOdometerKm"));
    const purchasePrice = Number(formData.get("purchasePrice"));
    const modelYear = Number(formData.get("modelYear"));

    const currentYear = new Date().getFullYear();

    if (capacityKg <= 0) {
      setError("Truck capacity must be greater than 0 kg.");
      return;
    }

    if (odometerKm < 0) {
      setError("Odometer reading cannot be negative.");
      return;
    }

    if (purchasePrice < 0) {
      setError("Purchase price cannot be negative.");
      return;
    }

    if (modelYear < 1980 || modelYear > currentYear + 1) {
      setError("Please enter a valid model year.");
      return;
    }

    setSuccess(
      "Truck information is valid. Database saving will be enabled when the Laravel API is connected."
    );
  };
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/trucks"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Trucks
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
            <Truck size={21} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-(--text)">
              Add New Truck
            </h2>

            <p className="mt-1 text-sm text-(--text-muted)">
              Add a new vehicle to your fleet.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Enter the truck identification and vehicle details."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="registrationNumber"
              name="registrationNumber"
              label="Registration Number"
              placeholder="e.g. LEC-4582"
              required
            />

            <Input
              id="truckNumber"
              name="truckNumber"
              label="Fleet / Truck Number"
              placeholder="e.g. TRK-008"
            />

            <Input
              id="truckType"
              name="truckType"
              label="Truck Type"
              placeholder="e.g. Container Truck"
              required
            />

            <Input
              id="manufacturer"
              name="manufacturer"
              label="Manufacturer"
              placeholder="e.g. Hino"
              required
            />

            <Input
              id="model"
              name="model"
              label="Model"
              placeholder="e.g. 500 Series"
              required
            />

            <Input
              id="modelYear"
              name="modelYear"
              type="number"
              label="Model Year"
              placeholder="e.g. 2024"
              min="1980"
              required
            />
          </div>
        </FormSection>

        {/* Capacity & Identification */}
        <FormSection
          title="Capacity & Identification"
          description="Configure load capacity and vehicle identification numbers."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="capacityKg"
              name="capacityKg"
              type="number"
              label="Maximum Capacity (kg)"
              placeholder="e.g. 30000"
              min="1"
              required
            />

            <Input
              id="currentOdometerKm"
              name="currentOdometerKm"
              type="number"
              label="Current Odometer (km)"
              placeholder="e.g. 85000"
              min="0"
              required
            />

            <Input
              id="engineNumber"
              name="engineNumber"
              label="Engine Number"
              placeholder="Enter engine number"
              required
            />

            <Input
              id="chassisNumber"
              name="chassisNumber"
              label="Chassis Number"
              placeholder="Enter chassis number"
              required
            />
          </div>
        </FormSection>

        {/* Purchase Information */}
        <FormSection
          title="Purchase Information"
          description="Enter the vehicle purchase details."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              label="Purchase Date"
              required
            />

            <Input
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              label="Purchase Price (PKR)"
              placeholder="e.g. 12500000"
              min="0"
              required
            />
          </div>
        </FormSection>

        {/* Status */}
        <FormSection
          title="Operational Status"
          description="Set the initial status of this truck."
        >
          <div className="max-w-md">
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-(--text)"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue="available"
              className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
            >
              <option value="available">Available</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <p className="mt-2 text-xs text-(--text-muted)">
              Assigned and On Trip statuses will be managed through driver
              assignments and trips.
            </p>
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection
          title="Notes"
          description="Add any optional information about this truck."
        >
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Optional notes..."
            className="w-full resize-none rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
          />
        </FormSection>


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

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/trucks"
            className="inline-flex items-center justify-center rounded-xl border border-(--border) bg-white px-5 py-3 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <Button type="submit">
            Add Truck
          </Button>
        </div>
      </form>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-(--border) bg-white p-6">
      <div className="mb-6 border-b border-(--border) pb-5">
        <h3 className="font-semibold text-(--text)">
          {title}
        </h3>

        <p className="mt-1 text-sm text-(--text-muted)">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}