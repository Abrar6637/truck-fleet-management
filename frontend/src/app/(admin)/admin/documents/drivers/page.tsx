"use client";

import { driverDocuments } from "@/data/driverDocuments";
import { drivers } from "@/data/drivers";
import {
  getDocumentExpiryStatus,
  getExpiryLabel,
} from "@/lib/documentExpiry";
import {
  DriverDocumentType,
  DriverDocumentVerificationStatus,
} from "@/types/driverDocument";
import {
  AlertTriangle,
  CirclePlus,
  Clock3,
  FileCheck2,
  Files,
  Search,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ExpiryFilter =
  | "all"
  | "expired"
  | "expires_soon"
  | "valid"
  | "no_expiry";

const documentTypeLabels: Record<
  DriverDocumentType,
  string
> = {
  driving_license: "Driving License",
  cnic: "CNIC",
  medical_certificate: "Medical Certificate",
  police_verification: "Police Verification",
  other: "Other",
};

const verificationLabels: Record<
  DriverDocumentVerificationStatus,
  string
> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

const verificationClasses: Record<
  DriverDocumentVerificationStatus,
  string
> = {
  pending: "bg-amber-50 text-amber-700",
  verified: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default function DriverDocumentsPage() {
  const [search, setSearch] = useState("");

  const [documentTypeFilter, setDocumentTypeFilter] =
    useState<DriverDocumentType | "all">("all");

  const [expiryFilter, setExpiryFilter] =
    useState<ExpiryFilter>("all");

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return driverDocuments.filter((document) => {
      const driver = drivers.find(
        (item) => item.id === document.driverId
      );

      const expiry = getDocumentExpiryStatus(
        document.expiryDate
      );

      const matchesSearch =
        !query ||
        [
          driver?.name,
          driver?.phone,
          document.documentNumber,
          documentTypeLabels[document.documentType],
          document.issuingAuthority,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesType =
        documentTypeFilter === "all" ||
        document.documentType === documentTypeFilter;

      const matchesExpiry =
        expiryFilter === "all" ||
        expiry.status === expiryFilter;

      return matchesSearch && matchesType && matchesExpiry;
    });
  }, [search, documentTypeFilter, expiryFilter]);

  const expiredLicenseCount = driverDocuments.filter(
    (document) =>
      document.documentType === "driving_license" &&
      getDocumentExpiryStatus(document.expiryDate).status ===
        "expired"
  ).length;

  const expiringLicenseCount = driverDocuments.filter(
    (document) =>
      document.documentType === "driving_license" &&
      getDocumentExpiryStatus(document.expiryDate).status ===
        "expires_soon"
  ).length;

  const verificationAttentionCount = driverDocuments.filter(
    (document) =>
      document.verificationStatus === "pending" ||
      document.verificationStatus === "rejected"
  ).length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h2 className="text-2xl font-bold text-(--text)">
            Driver Documents
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage driving licenses, CNICs, medical certificates
            and document expiry alerts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/documents"
            className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            <Truck size={17} />
            Truck Documents
          </Link>

          <Link
            href="/admin/documents/drivers/add"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <CirclePlus size={17} />
            Add Driver Document
          </Link>
        </div>
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Documents"
          value={String(driverDocuments.length)}
          subtitle="Driver documents recorded"
          icon={Files}
        />

        <SummaryCard
          title="Expired Licenses"
          value={String(expiredLicenseCount)}
          subtitle="Driver action required"
          icon={AlertTriangle}
        />

        <SummaryCard
          title="Licenses Expiring Soon"
          value={String(expiringLicenseCount)}
          subtitle="Within next 30 days"
          icon={Clock3}
        />

        <SummaryCard
          title="Verification Attention"
          value={String(verificationAttentionCount)}
          subtitle="Pending or rejected"
          icon={FileCheck2}
        />
      </section>

      {/* Important Alert */}
      {(expiredLicenseCount > 0 ||
        expiringLicenseCount > 0 ||
        verificationAttentionCount > 0) && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <p className="font-semibold text-amber-900">
              Driver document attention required
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Expired, expiring, pending or rejected driving
              licenses should be reviewed before assigning new
              operational work to a driver.
            </p>
          </div>
        </div>
      )}

      {/* Documents Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) p-5">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h3 className="font-semibold text-(--text)">
                Driver Documents
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                {filteredDocuments.length} document
                {filteredDocuments.length === 1 ? "" : "s"} found.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              {/* Search */}
              <div className="relative md:w-72">
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
                  placeholder="Search driver documents..."
                  className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
                />
              </div>

              {/* Document Type */}
              <select
                value={documentTypeFilter}
                onChange={(event) =>
                  setDocumentTypeFilter(
                    event.target.value as
                      | DriverDocumentType
                      | "all"
                  )
                }
                className={inputClass}
              >
                <option value="all">All Types</option>
                <option value="driving_license">
                  Driving License
                </option>
                <option value="cnic">CNIC</option>
                <option value="medical_certificate">
                  Medical Certificate
                </option>
                <option value="police_verification">
                  Police Verification
                </option>
                <option value="other">Other</option>
              </select>

              {/* Expiry */}
              <select
                value={expiryFilter}
                onChange={(event) =>
                  setExpiryFilter(
                    event.target.value as ExpiryFilter
                  )
                }
                className={inputClass}
              >
                <option value="all">
                  All Expiry Status
                </option>
                <option value="expired">Expired</option>
                <option value="expires_soon">
                  Expiring Soon
                </option>
                <option value="valid">Valid</option>
                <option value="no_expiry">
                  No Expiry
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Driver</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Document No.</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Expiry Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>File</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.map((document) => {
                const driver = drivers.find(
                  (item) => item.id === document.driverId
                );

                return (
                  <tr
                    key={document.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      {driver ? (
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-(--primary)">
                            <UserRound size={17} />
                          </div>

                          <div>
                            <Link
                              href={`/admin/drivers/${driver.id}`}
                              className="font-semibold text-(--text) transition hover:text-(--primary)"
                            >
                              {driver.name}
                            </Link>

                            <p className="mt-1 text-xs text-(--text-muted)">
                              {driver.phone}
                            </p>
                          </div>
                        </div>
                      ) : (
                        "Unknown Driver"
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-(--text)">
                        {
                          documentTypeLabels[
                            document.documentType
                          ]
                        }
                      </span>
                    </TableCell>

                    <TableCell>
                      {document.documentNumber}
                    </TableCell>

                    <TableCell>
                      {document.issuingAuthority ?? "—"}
                    </TableCell>

                    <TableCell>
                      {formatDate(document.issueDate)}
                    </TableCell>

                    <TableCell>
                      {formatDate(document.expiryDate)}
                    </TableCell>

                    <TableCell>
                      <ExpiryBadge
                        expiryDate={document.expiryDate}
                      />
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          verificationClasses[
                            document.verificationStatus
                          ]
                        }`}
                      >
                        {
                          verificationLabels[
                            document.verificationStatus
                          ]
                        }
                      </span>
                    </TableCell>

                    <TableCell>
                      {document.fileName ? (
                        <span className="inline-flex max-w-48 items-center gap-1.5 truncate text-sm font-medium text-(--primary)">
                          <FileCheck2 size={15} />
                          {document.fileName}
                        </span>
                      ) : (
                        <span className="text-(--text-muted)">
                          No file
                        </span>
                      )}
                    </TableCell>
                  </tr>
                );
              })}

              {filteredDocuments.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No driver documents found.
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

function ExpiryBadge({
  expiryDate,
}: {
  expiryDate?: string;
}) {
  const result = getDocumentExpiryStatus(expiryDate);

  let badgeClass = "bg-green-50 text-green-700";

  if (result.status === "expired") {
    badgeClass = "bg-red-50 text-red-700";
  } else if (result.alertLevel === "7_days") {
    badgeClass = "bg-red-50 text-red-700";
  } else if (result.alertLevel === "15_days") {
    badgeClass = "bg-orange-50 text-orange-700";
  } else if (result.alertLevel === "30_days") {
    badgeClass = "bg-amber-50 text-amber-700";
  } else if (result.status === "no_expiry") {
    badgeClass = "bg-slate-100 text-slate-700";
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}
    >
      {getExpiryLabel(result)}
    </span>
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
  icon: typeof Files;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--text-muted)">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-(--text)">
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

function formatDate(date?: string): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

const inputClass =
  "rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";