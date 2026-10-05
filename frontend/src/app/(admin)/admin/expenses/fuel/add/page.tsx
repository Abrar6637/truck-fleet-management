"use client";

import { drivers } from "@/data/drivers";
import { trips } from "@/data/trips";
import { trucks } from "@/data/trucks";
import {
  ArrowLeft,
  Calculator,
  Fuel,
  Gauge,
  ReceiptText,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function AddFuelEntryPage() {
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [litres, setLitres] = useState("");
  const [pricePerLitre, setPricePerLitre] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const truckId = Number(selectedTruckId);
  const tripId = Number(selectedTripId);

  const selectedTruck = trucks.find(
    (truck) => truck.id === truckId
  );

  /*
   * Only show trips belonging to the selected truck.
   * Cancelled/completed trips are excluded from a new fuel entry.
   */
  const availableTrips = useMemo(() => {
    if (!truckId) return [];

    return trips.filter(
      (trip) =>
        trip.truckId === truckId &&
        !["completed", "cancelled"].includes(trip.status)
    );
  }, [truckId]);

  const selectedTrip = availableTrips.find(
    (trip) => trip.id === tripId
  );

  /*
   * If a trip is selected, its assigned driver is automatically
   * determined from the trip.
   */
  const selectedDriver = selectedTrip
    ? drivers.find(
        (driver) => driver.id === selectedTrip.driverId
      )
    : undefined;

  const litresNumber = Number(litres) || 0;
  const priceNumber = Number(pricePerLitre) || 0;

  const totalAmount = litresNumber * priceNumber;

  const handleTruckChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTruckId(event.target.value);

    // Reset trip because trips depend on the selected truck.
    setSelectedTripId("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const fuelDate = String(
      formData.get("fuelDate") ?? ""
    );

    const fuelStation = String(
      formData.get("fuelStation") ?? ""
    ).trim();

    const odometerKm = Number(
      formData.get("odometerKm")
    );

    if (!truckId) {
      setError("Please select a truck.");
      return;
    }

    if (!fuelDate) {
      setError("Please select the fuel date.");
      return;
    }

    if (!fuelStation) {
      setError("Please enter the fuel station.");
      return;
    }

    if (litresNumber <= 0) {
      setError("Fuel litres must be greater than 0.");
      return;
    }

    if (priceNumber <= 0) {
      setError("Price per litre must be greater than 0.");
      return;
    }

    if (!Number.isFinite(odometerKm) || odometerKm < 0) {
      setError("Please enter a valid odometer reading.");
      return;
    }

    /*
     * Do not allow a fuel entry with an odometer lower than
     * the truck's current recorded odometer.
     */
    if (
      selectedTruck &&
      odometerKm < selectedTruck.currentOdometerKm
    ) {
      setError(
        `Odometer cannot be lower than the truck's current reading of ${selectedTruck.currentOdometerKm.toLocaleString()} km.`
      );
      return;
    }

    setSuccess(
      `Fuel entry is valid. PKR ${totalAmount.toLocaleString()} will be saved when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/expenses"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Fuel & Expenses
        </Link>

        <div>
          <h2 className="text-2xl font-bold text-(--text)">
            Add Fuel Entry
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Record fuel purchased for a fleet truck.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Truck & Trip */}
        <FormSection
          title="Truck & Trip"
          description="Select the truck and optionally link this fuel entry to an active trip."
          icon={<Truck size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Truck" required>
              <select
                name="truckId"
                value={selectedTruckId}
                onChange={handleTruckChange}
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

            <Field label="Trip">
              <select
                name="tripId"
                value={selectedTripId}
                onChange={(event) =>
                  setSelectedTripId(event.target.value)
                }
                disabled={!selectedTruckId}
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
              >
                <option value="">
                  {selectedTruckId
                    ? "No trip / General fuel"
                    : "Select truck first"}
                </option>

                {availableTrips.map((trip) => (
                  <option
                    key={trip.id}
                    value={trip.id}
                  >
                    {trip.tripNumber} — {trip.origin} to{" "}
                    {trip.destination}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {selectedTrip && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">
                Trip Driver
              </p>

              <p className="mt-1 text-sm font-semibold text-(--text)">
                {selectedDriver?.name ?? "Driver not found"}
              </p>

              <p className="mt-1 text-xs text-(--text-muted)">
                Driver is automatically determined from the
                selected trip.
              </p>
            </div>
          )}
        </FormSection>

        {/* Fuel Information */}
        <FormSection
          title="Fuel Information"
          description="Enter the fuel quantity, rate and station information."
          icon={<Fuel size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Fuel Date" required>
              <input
                type="date"
                name="fuelDate"
                className={inputClass}
              />
            </Field>

            <Field label="Fuel Station" required>
              <input
                type="text"
                name="fuelStation"
                placeholder="e.g. PSO Lahore"
                className={inputClass}
              />
            </Field>

            <Field label="Litres" required>
              <input
                type="number"
                name="litres"
                min="0"
                step="0.01"
                value={litres}
                onChange={(event) =>
                  setLitres(event.target.value)
                }
                placeholder="e.g. 180"
                className={inputClass}
              />
            </Field>

            <Field label="Price Per Litre (PKR)" required>
              <input
                type="number"
                name="pricePerLitre"
                min="0"
                step="0.01"
                value={pricePerLitre}
                onChange={(event) =>
                  setPricePerLitre(event.target.value)
                }
                placeholder="e.g. 275"
                className={inputClass}
              />
            </Field>

            <Field label="Odometer (km)" required>
              <input
                type="number"
                name="odometerKm"
                min="0"
                placeholder={
                  selectedTruck
                    ? `Current: ${selectedTruck.currentOdometerKm}`
                    : "e.g. 185000"
                }
                className={inputClass}
              />
            </Field>

            <Field label="Receipt Number">
              <input
                type="text"
                name="receiptNumber"
                placeholder="e.g. PSO-1008"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Total */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
              <Calculator size={19} />
            </div>

            <div>
              <p className="text-sm font-medium text-(--text-muted)">
                Calculated Fuel Total
              </p>

              <p className="mt-1 text-2xl font-bold text-(--text)">
                PKR {totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-(--text-muted)">
            {litresNumber.toLocaleString()} litres × PKR{" "}
            {priceNumber.toLocaleString()} per litre
          </p>
        </section>

        {/* Receipt & Notes */}
        <FormSection
          title="Receipt & Notes"
          description="Add optional receipt and additional information."
          icon={<ReceiptText size={19} />}
        >
          <div className="space-y-5">
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
                placeholder="Optional notes about this fuel entry..."
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Validation Messages */}
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
            href="/admin/expenses"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <Gauge size={17} />
            Save Fuel Entry
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