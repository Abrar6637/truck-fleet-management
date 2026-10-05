import { drivers } from "@/data/drivers";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CalendarDays,
  IdCard,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface DriverDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusLabels = {
  available: "Available",
  assigned: "Assigned",
  on_trip: "On Trip",
  on_leave: "On Leave",
  inactive: "Inactive",
};

const statusClasses = {
  available: "bg-green-50 text-green-700",
  assigned: "bg-indigo-50 text-indigo-700",
  on_trip: "bg-blue-50 text-blue-700",
  on_leave: "bg-amber-50 text-amber-700",
  inactive: "bg-slate-100 text-slate-600",
};

const licenseLabels = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
  expired: "Expired",
};

const licenseClasses = {
  pending: "bg-amber-50 text-amber-700",
  verified: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  expired: "bg-red-50 text-red-700",
};

export default async function DriverDetailsPage({
  params,
}: DriverDetailsPageProps) {
  const { id } = await params;

  const driver = drivers.find(
    (item) => item.id === Number(id)
  );

  if (!driver) {
    notFound();
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/drivers"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Drivers
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
              <UserRound size={23} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-(--text)">
                {driver.name}
              </h2>

              <p className="mt-1 text-sm text-(--text-muted)">
                {driver.phone} • {driver.licenseNumber}
              </p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              statusClasses[driver.status]
            }`}
          >
            {statusLabels[driver.status]}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          label="Assigned Truck"
          value={driver.assignedTruckRegistration ?? "Unassigned"}
          icon={Truck}
        />

        <InfoCard
          label="Base Salary"
          value={`PKR ${driver.baseSalary.toLocaleString()}`}
          icon={Banknote}
        />

        <InfoCard
          label="Joining Date"
          value={driver.joiningDate}
          icon={CalendarDays}
        />

        <InfoCard
          label="License Status"
          value={licenseLabels[driver.licenseVerificationStatus]}
          icon={BadgeCheck}
        />
      </section>

      {/* Personal Information */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          title="Personal Information"
          description="Personal and contact information for this driver."
        />

        <div className="grid gap-x-10 gap-y-6 p-6 md:grid-cols-2 xl:grid-cols-3">
          <Detail
            label="Full Name"
            value={driver.name}
          />

          <Detail
            label="Phone"
            value={driver.phone}
          />

          <Detail
            label="Email"
            value={driver.email ?? "—"}
          />

          <Detail
            label="CNIC"
            value={driver.cnic}
          />

          <Detail
            label="Date of Birth"
            value={driver.dateOfBirth}
          />

          <Detail
            label="Address"
            value={driver.address}
          />
        </div>
      </section>

      {/* License */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          title="Driving License"
          description="HTV license and verification information."
        />

        <div className="grid gap-x-10 gap-y-6 p-6 md:grid-cols-2 xl:grid-cols-3">
          <Detail
            label="License Number"
            value={driver.licenseNumber}
          />

          <Detail
            label="Expiry Date"
            value={driver.licenseExpiryDate}
          />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
              Verification
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                licenseClasses[
                  driver.licenseVerificationStatus
                ]
              }`}
            >
              {
                licenseLabels[
                  driver.licenseVerificationStatus
                ]
              }
            </span>
          </div>
        </div>
      </section>

      {/* Employment & Assignment */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          title="Employment & Assignment"
          description="Employment details and current fleet assignment."
        />

        <div className="grid gap-x-10 gap-y-6 p-6 md:grid-cols-2 xl:grid-cols-3">
          <Detail
            label="Joining Date"
            value={driver.joiningDate}
          />

          <Detail
            label="Base Salary"
            value={`PKR ${driver.baseSalary.toLocaleString()}`}
          />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
              Assigned Truck
            </p>

            {driver.assignedTruckId &&
            driver.assignedTruckRegistration ? (
              <Link
                href={`/admin/trucks/${driver.assignedTruckId}`}
                className="mt-2 inline-block text-sm font-semibold text-(--primary) hover:underline"
              >
                {driver.assignedTruckRegistration}
              </Link>
            ) : (
              <p className="mt-2 text-sm font-semibold text-(--text)">
                Unassigned
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          title="Emergency Contact"
          description="Contact information to use in case of an emergency."
        />

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-(--text-muted)">
              <UserRound size={18} />
            </div>

            <div>
              <p className="text-xs text-(--text-muted)">
                Contact Name
              </p>

              <p className="mt-1 text-sm font-semibold text-(--text)">
                {driver.emergencyContactName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-(--text-muted)">
              <Phone size={18} />
            </div>

            <div>
              <p className="text-xs text-(--text-muted)">
                Contact Phone
              </p>

              <p className="mt-1 text-sm font-semibold text-(--text)">
                {driver.emergencyContactPhone}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-2xl border border-(--border) bg-white p-6">
        <h3 className="font-semibold text-(--text)">
          Notes
        </h3>

        <p className="mt-3 text-sm leading-6 text-(--text-muted)">
          {driver.notes ||
            "No notes have been added for this driver."}
        </p>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-(--border) px-6 py-5">
      <h3 className="font-semibold text-(--text)">
        {title}
      </h3>

      <p className="mt-1 text-sm text-(--text-muted)">
        {description}
      </p>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof UserRound;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted)">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-(--text)">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({
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

      <p className="mt-2 text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}