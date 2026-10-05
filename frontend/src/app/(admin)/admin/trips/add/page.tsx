"use client";

import { drivers } from "@/data/drivers";
import { truckAssignments } from "@/data/truckAssignments";
import { trucks } from "@/data/trucks";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  MapPin,
  Package,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function AddTripPage() {
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [loadedWeight, setLoadedWeight] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeAssignments = truckAssignments.filter(
    (assignment) => assignment.status === "active"
  );

  // Only trucks with an active driver assignment can be selected.
  // Maintenance, breakdown and inactive trucks are blocked.
  const eligibleTrucks = trucks.filter((truck) => {
    const hasActiveAssignment = activeAssignments.some(
      (assignment) => assignment.truckId === truck.id
    );

    return (
      hasActiveAssignment &&
      !["maintenance", "breakdown", "inactive"].includes(truck.status)
    );
  });

  const selectedTruck = useMemo(
    () =>
      trucks.find(
        (truck) => truck.id === Number(selectedTruckId)
      ),
    [selectedTruckId]
  );

  const selectedAssignment = activeAssignments.find(
    (assignment) =>
      assignment.truckId === Number(selectedTruckId)
  );

  const selectedDriver = selectedAssignment
    ? drivers.find(
        (driver) => driver.id === selectedAssignment.driverId
      )
    : undefined;

  const loadedWeightKg = Number(loadedWeight) || 0;

  const remainingCapacity = selectedTruck
    ? selectedTruck.capacityKg - loadedWeightKg
    : 0;

  const utilization =
    selectedTruck && selectedTruck.capacityKg > 0
      ? (loadedWeightKg / selectedTruck.capacityKg) * 100
      : 0;

  const isOverloaded =
    !!selectedTruck &&
    loadedWeightKg > selectedTruck.capacityKg;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const truckId = Number(formData.get("truckId"));

    const origin = String(
      formData.get("origin") ?? ""
    ).trim();

    const destination = String(
      formData.get("destination") ?? ""
    ).trim();

    const startDate = String(
      formData.get("startDate") ?? ""
    );

    const expectedDeliveryDate = String(
      formData.get("expectedDeliveryDate") ?? ""
    );

    const goodsType = String(
      formData.get("goodsType") ?? ""
    ).trim();

    const pickupCompanyName = String(
      formData.get("pickupCompanyName") ?? ""
    ).trim();

    const pickupContactPerson = String(
      formData.get("pickupContactPerson") ?? ""
    ).trim();

    const pickupPhone = String(
      formData.get("pickupPhone") ?? ""
    ).trim();

    const pickupAddress = String(
      formData.get("pickupAddress") ?? ""
    ).trim();

    const deliveryCompanyName = String(
      formData.get("deliveryCompanyName") ?? ""
    ).trim();

    const deliveryContactPerson = String(
      formData.get("deliveryContactPerson") ?? ""
    ).trim();

    const deliveryPhone = String(
      formData.get("deliveryPhone") ?? ""
    ).trim();

    const deliveryAddress = String(
      formData.get("deliveryAddress") ?? ""
    ).trim();

    const tripAmountValue = String(
      formData.get("tripAmount") ?? ""
    ).trim();

    const tripAmount = Number(tripAmountValue);

    // Truck validation
    if (!truckId) {
      setError("Please select a truck.");
      return;
    }

    if (!selectedTruck) {
      setError("Selected truck could not be found.");
      return;
    }

    if (!selectedDriver) {
      setError(
        "The selected truck does not have a valid active driver assignment."
      );
      return;
    }

    // Route validation
    if (!origin || !destination) {
      setError("Origin and destination are required.");
      return;
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
      setError("Origin and destination cannot be the same.");
      return;
    }

    // Date validation
    if (!startDate || !expectedDeliveryDate) {
      setError("Trip dates are required.");
      return;
    }

    if (expectedDeliveryDate < startDate) {
      setError(
        "Expected delivery date cannot be before the start date."
      );
      return;
    }

    // Load validation
    if (!goodsType) {
      setError("Goods type is required.");
      return;
    }

    if (loadedWeightKg <= 0) {
      setError("Loaded weight must be greater than 0 kg.");
      return;
    }

    if (loadedWeightKg > selectedTruck.capacityKg) {
      setError(
        `Overloading is not allowed. ${selectedTruck.registrationNumber} has a maximum capacity of ${selectedTruck.capacityKg.toLocaleString()} kg.`
      );
      return;
    }

    // Pickup validation
    if (!pickupCompanyName) {
      setError("Pickup company name is required.");
      return;
    }

    if (!pickupContactPerson) {
      setError("Pickup contact person is required.");
      return;
    }

    if (!pickupPhone) {
      setError("Pickup phone number is required.");
      return;
    }

    if (!pickupAddress) {
      setError("Pickup address is required.");
      return;
    }

    // Delivery validation
    if (!deliveryCompanyName) {
      setError("Delivery company name is required.");
      return;
    }

    if (!deliveryContactPerson) {
      setError("Delivery contact person is required.");
      return;
    }

    if (!deliveryPhone) {
      setError("Delivery phone number is required.");
      return;
    }

    if (!deliveryAddress) {
      setError("Delivery address is required.");
      return;
    }

    // Amount validation
    if (!tripAmountValue) {
      setError("Trip amount is required.");
      return;
    }

    if (!Number.isFinite(tripAmount) || tripAmount < 0) {
      setError("Please enter a valid trip amount.");
      return;
    }

    setSuccess(
      "Trip information is valid. It will be saved when the Laravel API is connected."
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/trips"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Trips
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Add New Trip
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Create a fleet trip with truck, driver, load, pickup,
          delivery, and revenue information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Truck & Driver */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="mb-6 border-b border-(--border) pb-5">
            <h3 className="font-semibold text-(--text)">
              Truck & Driver
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Select a truck. Its active assigned driver will be
              selected automatically.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="truckId"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Truck
              </label>

              <div className="relative">
                <Truck
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <select
                  id="truckId"
                  name="truckId"
                  value={selectedTruckId}
                  onChange={(event) => {
                    setSelectedTruckId(event.target.value);
                    setLoadedWeight("");
                    setError("");
                    setSuccess("");
                  }}
                  required
                  className="w-full rounded-xl border border-(--border) bg-white py-3 pl-11 pr-4 text-sm text-(--text) outline-none focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select truck</option>

                  {eligibleTrucks.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      {truck.registrationNumber} —{" "}
                      {truck.manufacturer} {truck.model} —{" "}
                      {truck.capacityKg.toLocaleString()} kg
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-2 text-xs text-(--text-muted)">
                {eligibleTrucks.length} truck(s) eligible for trips.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-(--text)">
                Assigned Driver
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  value={
                    selectedDriver
                      ? selectedDriver.name
                      : "Select a truck first"
                  }
                  readOnly
                  className="w-full rounded-xl border border-(--border) bg-slate-50 py-3 pl-11 pr-4 text-sm text-(--text)"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Route & Schedule */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="mb-6 border-b border-(--border) pb-5">
            <h3 className="font-semibold text-(--text)">
              Route & Schedule
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Enter the trip route and expected schedule.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Origin"
              name="origin"
              placeholder="e.g. Lahore"
              icon={<MapPin size={18} />}
              required
            />

            <Field
              label="Destination"
              name="destination"
              placeholder="e.g. Karachi"
              icon={<MapPin size={18} />}
              required
            />

            <Field
              label="Start Date"
              name="startDate"
              type="date"
              icon={<CalendarDays size={18} />}
              required
            />

            <Field
              label="Expected Delivery Date"
              name="expectedDeliveryDate"
              type="date"
              icon={<CalendarDays size={18} />}
              required
            />
          </div>
        </section>

        {/* Load & Capacity */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="mb-6 border-b border-(--border) pb-5">
            <h3 className="font-semibold text-(--text)">
              Load & Capacity
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Enter the cargo details. Loaded weight cannot exceed
              the selected truck&apos;s maximum capacity.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Goods Type"
              name="goodsType"
              placeholder="e.g. Textile"
              icon={<Package size={18} />}
              required
            />

            <div>
              <label
                htmlFor="loadedWeightKg"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Loaded Weight (kg)
              </label>

              <input
                id="loadedWeightKg"
                name="loadedWeightKg"
                type="number"
                min="1"
                value={loadedWeight}
                onChange={(event) => {
                  setLoadedWeight(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="e.g. 24000"
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-(--text) outline-none focus:ring-2 ${
                  isOverloaded
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-(--border) focus:border-(--primary) focus:ring-blue-100"
                }`}
              />
            </div>
          </div>

          {selectedTruck && (
            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <CapacityItem
                  label="Maximum Capacity"
                  value={`${selectedTruck.capacityKg.toLocaleString()} kg`}
                />

                <CapacityItem
                  label="Remaining Capacity"
                  value={`${remainingCapacity.toLocaleString()} kg`}
                  danger={remainingCapacity < 0}
                />

                <CapacityItem
                  label="Load Utilization"
                  value={`${utilization.toFixed(1)}%`}
                  danger={utilization > 100}
                />
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    isOverloaded
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

              {loadedWeightKg > 0 && !isOverloaded && (
                <p className="mt-3 text-xs text-(--text-muted)">
                  Current trip load:{" "}
                  <span className="font-semibold text-(--text)">
                    {loadedWeightKg.toLocaleString()} kg
                  </span>
                  {" · "}
                  Remaining:{" "}
                  <span className="font-semibold text-(--text)">
                    {remainingCapacity.toLocaleString()} kg
                  </span>
                </p>
              )}

              {isOverloaded && (
                <p className="mt-3 text-sm font-semibold text-(--danger)">
                  Overload detected. Reduce the loaded weight before
                  creating this trip.
                </p>
              )}
            </div>
          )}

          <div className="mt-5">
            <label
              htmlFor="goodsDescription"
              className="mb-2 block text-sm font-medium text-(--text)"
            >
              Goods Description
            </label>

            <textarea
              id="goodsDescription"
              name="goodsDescription"
              rows={3}
              placeholder="Optional description of the cargo..."
              className="w-full resize-none rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </section>

        {/* Pickup Company */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="mb-6 border-b border-(--border) pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                <Building2 size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-(--text)">
                  Pickup Company
                </h3>

                <p className="mt-1 text-sm text-(--text-muted)">
                  Company or location where the goods will be loaded.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Company Name"
              name="pickupCompanyName"
              placeholder="e.g. ABC Textiles"
              icon={<Building2 size={18} />}
              required
            />

            <Field
              label="Contact Person"
              name="pickupContactPerson"
              placeholder="e.g. Ahmed Raza"
              icon={<UserRound size={18} />}
              required
            />

            <Field
              label="Phone Number"
              name="pickupPhone"
              type="tel"
              placeholder="e.g. 0300-1234567"
              icon={<Phone size={18} />}
              required
            />

            <Field
              label="Pickup Address"
              name="pickupAddress"
              placeholder="e.g. Sundar Industrial Estate, Lahore"
              icon={<MapPin size={18} />}
              required
            />
          </div>
        </section>

        {/* Delivery Company */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="mb-6 border-b border-(--border) pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Building2 size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-(--text)">
                  Delivery Company
                </h3>

                <p className="mt-1 text-sm text-(--text-muted)">
                  Company or location where the goods will be delivered.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Company Name"
              name="deliveryCompanyName"
              placeholder="e.g. DEF Traders"
              icon={<Building2 size={18} />}
              required
            />

            <Field
              label="Contact Person"
              name="deliveryContactPerson"
              placeholder="e.g. Usman Khan"
              icon={<UserRound size={18} />}
              required
            />

            <Field
              label="Phone Number"
              name="deliveryPhone"
              type="tel"
              placeholder="e.g. 0312-7654321"
              icon={<Phone size={18} />}
              required
            />

            <Field
              label="Delivery Address"
              name="deliveryAddress"
              placeholder="e.g. SITE Industrial Area, Karachi"
              icon={<MapPin size={18} />}
              required
            />
          </div>
        </section>

        {/* Trip Information */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="mb-6 border-b border-(--border) pb-5">
            <h3 className="font-semibold text-(--text)">
              Trip Information
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Enter trip revenue and additional instructions.
            </p>
          </div>

          <div className="max-w-md">
            <Field
              label="Trip Amount (PKR)"
              name="tripAmount"
              type="number"
              placeholder="e.g. 185000"
              required
            />
          </div>

          <div className="mt-5">
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
              placeholder="Optional trip notes or special instructions..."
              className="w-full resize-none rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-(--danger)"
          >
            {error}
          </div>
        )}

        {/* Success */}
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
            href="/admin/trips"
            className="inline-flex items-center justify-center rounded-xl border border-(--border) bg-white px-5 py-3 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isOverloaded}
            className="rounded-xl bg-(--primary) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-(--text)"
      >
        {label}

        {required && (
          <span className="ml-1 text-(--danger)">*</span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          min={type === "number" ? "0" : undefined}
          className={`w-full rounded-xl border border-(--border) bg-white py-3 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100 ${
            icon ? "pl-11" : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}

function CapacityItem({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-(--text-muted)">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${
          danger ? "text-(--danger)" : "text-(--text)"
        }`}
      >
        {value}
      </p>
    </div>
  );
}