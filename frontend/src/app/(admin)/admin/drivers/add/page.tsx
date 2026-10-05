"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { trucks } from "@/data/trucks";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AddDriverPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const baseSalary = Number(formData.get("baseSalary"));
    const dateOfBirth = String(formData.get("dateOfBirth"));
    const joiningDate = String(formData.get("joiningDate"));
    const licenseExpiryDate = String(
      formData.get("licenseExpiryDate")
    );

    if (baseSalary < 0) {
      setError("Base salary cannot be negative.");
      return;
    }

    if (!dateOfBirth || !joiningDate || !licenseExpiryDate) {
      setError("Please complete all required date fields.");
      return;
    }

    if (new Date(dateOfBirth) >= new Date()) {
      setError("Please enter a valid date of birth.");
      return;
    }

    setSuccess(
      "Driver information is valid. Database saving will be enabled when the Laravel API is connected."
    );
  };

  const assignableTrucks = trucks.filter(
    (truck) =>
      truck.status === "available" ||
      truck.status === "assigned"
  );

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/drivers"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Drivers
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
            <UserPlus size={21} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-(--text)">
              Add New Driver
            </h2>

            <p className="mt-1 text-sm text-(--text-muted)">
              Add a driver and their employment and license information.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <FormSection
          title="Personal Information"
          description="Enter the driver's basic personal and contact information."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="name"
              name="name"
              label="Full Name"
              placeholder="e.g. Ahmed Khan"
              required
            />

            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              placeholder="e.g. 0300-1234567"
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="driver@example.com"
            />

            <Input
              id="cnic"
              name="cnic"
              label="CNIC"
              placeholder="35202-1234567-1"
              required
            />

            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              label="Date of Birth"
              required
            />

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                required
                placeholder="e.g. Lahore, Punjab"
                className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </FormSection>

        {/* Emergency Contact */}
        <FormSection
          title="Emergency Contact"
          description="Add a contact person to use in case of an emergency."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="emergencyContactName"
              name="emergencyContactName"
              label="Contact Name"
              placeholder="Emergency contact name"
              required
            />

            <Input
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              type="tel"
              label="Contact Phone"
              placeholder="e.g. 0301-7654321"
              required
            />
          </div>
        </FormSection>

        {/* Employment */}
        <FormSection
          title="Employment Information"
          description="Configure the driver's joining date and salary."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="joiningDate"
              name="joiningDate"
              type="date"
              label="Joining Date"
              required
            />

            <Input
              id="baseSalary"
              name="baseSalary"
              type="number"
              label="Base Salary (PKR)"
              placeholder="e.g. 60000"
              min="0"
              required
            />
          </div>
        </FormSection>

        {/* License */}
        <FormSection
          title="Driving License"
          description="Enter the driver's HTV license information."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="licenseNumber"
              name="licenseNumber"
              label="License Number"
              placeholder="e.g. LHR-HTV-45821"
              required
            />

            <Input
              id="licenseExpiryDate"
              name="licenseExpiryDate"
              type="date"
              label="License Expiry Date"
              required
            />

            <div>
              <label
                htmlFor="licenseVerificationStatus"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Verification Status
              </label>

              <select
                id="licenseVerificationStatus"
                name="licenseVerificationStatus"
                defaultValue="pending"
                className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-(--text)"
              >
                Driver Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="available"
                className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
              >
                <option value="available">Available</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>

              <p className="mt-2 text-xs text-(--text-muted)">
                Assigned and On Trip statuses will be managed by fleet
                assignments and trips.
              </p>
            </div>
          </div>
        </FormSection>

        {/* Truck Assignment */}
        <FormSection
          title="Initial Truck Assignment"
          description="Optionally assign an available truck to this driver."
        >
          <div className="max-w-md">
            <label
              htmlFor="assignedTruckId"
              className="mb-2 block text-sm font-medium text-(--text)"
            >
              Truck
            </label>

            <select
              id="assignedTruckId"
              name="assignedTruckId"
              defaultValue=""
              className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
            >
              <option value="">No truck assigned</option>

              {assignableTrucks.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {truck.registrationNumber} — {truck.manufacturer}{" "}
                  {truck.model}
                </option>
              ))}
            </select>
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection
          title="Notes"
          description="Add any optional information about this driver."
        >
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Optional notes..."
            className="w-full resize-none rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
          />
        </FormSection>

        {/* Messages */}
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
            href="/admin/drivers"
            className="inline-flex items-center justify-center rounded-xl border border-(--border) bg-white px-5 py-3 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <Button type="submit">
            Add Driver
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