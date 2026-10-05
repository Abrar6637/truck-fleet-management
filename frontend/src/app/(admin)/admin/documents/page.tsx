"use client";

import { truckDocuments } from "@/data/truckDocuments";
import { trucks } from "@/data/trucks";
import {
  getDocumentExpiryStatus,
  getExpiryLabel,
} from "@/lib/documentExpiry";
import {
  DocumentVerificationStatus,
  TruckDocumentType,
} from "@/types/truckDocument";
import {
  AlertTriangle,
  CirclePlus,
  Clock3,
  FileCheck2,
  Files,
  Search,
  Truck,
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
  TruckDocumentType,
  string
> = {
  registration: "Registration",
  fitness_certificate: "Fitness Certificate",
  route_permit: "Route Permit",
  insurance: "Insurance",
  token_tax: "Token Tax",
  other: "Other",
};

const verificationLabels: Record<
  DocumentVerificationStatus,
  string
> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

const verificationClasses: Record<
  DocumentVerificationStatus,
  string
> = {
  pending: "bg-amber-50 text-amber-700",
  verified: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const [
    documentTypeFilter,
    setDocumentTypeFilter,
  ] = useState<TruckDocumentType | "all">(
    "all"
  );

  const [expiryFilter, setExpiryFilter] =
    useState<ExpiryFilter>("all");

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return truckDocuments.filter(
      (document) => {
        const truck = trucks.find(
          (item) =>
            item.id === document.truckId
        );

        const expiry =
          getDocumentExpiryStatus(
            document.expiryDate
          );

        const matchesSearch =
          !query ||
          [
            document.documentNumber,
            documentTypeLabels[
              document.documentType
            ],
            document.issuingAuthority,
            document.fileName,
            truck?.registrationNumber,
            truck?.truckNumber,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesType =
          documentTypeFilter === "all" ||
          document.documentType ===
            documentTypeFilter;

        const matchesExpiry =
          expiryFilter === "all" ||
          expiry.status === expiryFilter;

        return (
          matchesSearch &&
          matchesType &&
          matchesExpiry
        );
      }
    );
  }, [
    search,
    documentTypeFilter,
    expiryFilter,
  ]);

  const expiredCount = truckDocuments.filter(
    (document) =>
      getDocumentExpiryStatus(
        document.expiryDate
      ).status === "expired"
  ).length;

  const expiringSoonCount =
    truckDocuments.filter(
      (document) =>
        getDocumentExpiryStatus(
          document.expiryDate
        ).status === "expires_soon"
    ).length;

  const verificationAttentionCount =
    truckDocuments.filter(
      (document) =>
        document.verificationStatus ===
          "pending" ||
        document.verificationStatus ===
          "rejected"
    ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
            Truck Documents
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage truck documents, verification
            and expiry alerts.
          </p>
        </div>

        <Link
          href="/admin/documents/add"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-fit"
        >
          <CirclePlus size={17} />
          Add Document
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Documents"
          value={String(
            truckDocuments.length
          )}
          subtitle="Truck documents recorded"
          icon={Files}
        />

        <SummaryCard
          title="Expired"
          value={String(expiredCount)}
          subtitle="Renewal required"
          icon={AlertTriangle}
        />

        <SummaryCard
          title="Expiring Soon"
          value={String(expiringSoonCount)}
          subtitle="Within next 30 days"
          icon={Clock3}
        />

        <SummaryCard
          title="Verification Attention"
          value={String(
            verificationAttentionCount
          )}
          subtitle="Pending or rejected"
          icon={FileCheck2}
        />
      </section>

      {/* Documents */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Filters */}
        <div className="border-b border-(--border) p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="font-semibold text-(--text)">
                Documents
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                {filteredDocuments.length}{" "}
                document
                {filteredDocuments.length === 1
                  ? ""
                  : "s"}{" "}
                found.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[288px_auto_auto]">
              {/* Search */}
              <div className="relative sm:col-span-2 xl:col-span-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search documents..."
                  className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
                />
              </div>

              {/* Type */}
              <select
                value={documentTypeFilter}
                onChange={(event) =>
                  setDocumentTypeFilter(
                    event.target.value as
                      | TruckDocumentType
                      | "all"
                  )
                }
                className={inputClass}
              >
                <option value="all">
                  All Types
                </option>

                <option value="registration">
                  Registration
                </option>

                <option value="fitness_certificate">
                  Fitness Certificate
                </option>

                <option value="route_permit">
                  Route Permit
                </option>

                <option value="insurance">
                  Insurance
                </option>

                <option value="token_tax">
                  Token Tax
                </option>

                <option value="other">
                  Other
                </option>
              </select>

              {/* Expiry */}
              <select
                value={expiryFilter}
                onChange={(event) =>
                  setExpiryFilter(
                    event.target
                      .value as ExpiryFilter
                  )
                }
                className={inputClass}
              >
                <option value="all">
                  All Expiry Status
                </option>

                <option value="expired">
                  Expired
                </option>

                <option value="expires_soon">
                  Expiring Soon
                </option>

                <option value="valid">
                  Valid
                </option>

                <option value="no_expiry">
                  No Expiry
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Document Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredDocuments.map(
            (document) => {
              const truck = trucks.find(
                (item) =>
                  item.id ===
                  document.truckId
              );

              return (
                <div
                  key={document.id}
                  className="p-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                          <Files size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-(--text)">
                            {
                              documentTypeLabels[
                                document
                                  .documentType
                              ]
                            }
                          </p>

                          <p className="mt-1 break-all text-xs text-(--text-muted)">
                            {
                              document.documentNumber
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <ExpiryBadge
                      expiryDate={
                        document.expiryDate
                      }
                    />
                  </div>

                  {/* Truck */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                      Truck
                    </p>

                    {truck ? (
                      <div className="mt-1">
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="text-sm font-semibold text-(--primary)"
                        >
                          {
                            truck.registrationNumber
                          }
                        </Link>

                        {truck.truckNumber && (
                          <span className="ml-2 text-xs text-(--text-muted)">
                            {
                              truck.truckNumber
                            }
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-(--text)">
                        Unknown Truck
                      </p>
                    )}
                  </div>

                  {/* Document Details */}
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                    <MobileInfo
                      label="Issue Date"
                      value={formatDate(
                        document.issueDate
                      )}
                    />

                    <MobileInfo
                      label="Expiry Date"
                      value={formatDate(
                        document.expiryDate
                      )}
                    />

                    <MobileInfo
                      label="Authority"
                      value={
                        document.issuingAuthority ??
                        "—"
                      }
                    />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                        Verification
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          verificationClasses[
                            document
                              .verificationStatus
                          ]
                        }`}
                      >
                        {
                          verificationLabels[
                            document
                              .verificationStatus
                          ]
                        }
                      </span>
                    </div>
                  </div>

                  {/* File */}
                  <div className="mt-4 rounded-xl border border-(--border) p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                      File
                    </p>

                    {document.fileName ? (
                      <div className="mt-2 flex min-w-0 items-center gap-2 text-sm font-medium text-(--primary)">
                        <FileCheck2
                          size={16}
                          className="shrink-0"
                        />

                        <span className="min-w-0 break-all">
                          {document.fileName}
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-(--text-muted)">
                        No file
                      </p>
                    )}
                  </div>

                  {truck && (
                    <Link
                      href={`/admin/trucks/${truck.id}`}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
                    >
                      <Truck size={16} />
                      View Truck
                    </Link>
                  )}
                </div>
              );
            }
          )}

          {filteredDocuments.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Truck</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>
                  Document No.
                </TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>
                  Expiry Status
                </TableHead>
                <TableHead>
                  Verification
                </TableHead>
                <TableHead>File</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.map(
                (document) => {
                  const truck = trucks.find(
                    (item) =>
                      item.id ===
                      document.truckId
                  );

                  return (
                    <tr
                      key={document.id}
                      className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                    >
                      <TableCell>
                        {truck ? (
                          <>
                            <Link
                              href={`/admin/trucks/${truck.id}`}
                              className="font-semibold text-(--text) transition hover:text-(--primary)"
                            >
                              {
                                truck.registrationNumber
                              }
                            </Link>

                            {truck.truckNumber && (
                              <p className="mt-1 text-xs text-(--text-muted)">
                                {
                                  truck.truckNumber
                                }
                              </p>
                            )}
                          </>
                        ) : (
                          "Unknown Truck"
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-(--text)">
                          {
                            documentTypeLabels[
                              document
                                .documentType
                            ]
                          }
                        </span>
                      </TableCell>

                      <TableCell>
                        {
                          document.documentNumber
                        }
                      </TableCell>

                      <TableCell>
                        {document.issuingAuthority ??
                          "—"}
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          document.issueDate
                        )}
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          document.expiryDate
                        )}
                      </TableCell>

                      <TableCell>
                        <ExpiryBadge
                          expiryDate={
                            document.expiryDate
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            verificationClasses[
                              document
                                .verificationStatus
                            ]
                          }`}
                        >
                          {
                            verificationLabels[
                              document
                                .verificationStatus
                            ]
                          }
                        </span>
                      </TableCell>

                      <TableCell>
                        {document.fileName ? (
                          <span className="inline-flex max-w-44 items-center gap-1.5 truncate text-sm font-medium text-(--primary)">
                            <FileCheck2
                              size={15}
                            />

                            {
                              document.fileName
                            }
                          </span>
                        ) : (
                          <span className="text-(--text-muted)">
                            No file
                          </span>
                        )}
                      </TableCell>
                    </tr>
                  );
                }
              )}

              {filteredDocuments.length ===
                0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No documents found.
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
  const result =
    getDocumentExpiryStatus(expiryDate);

  let badgeClass =
    "bg-green-50 text-green-700";

  if (result.status === "expired") {
    badgeClass =
      "bg-red-50 text-red-700";
  } else if (
    result.alertLevel === "7_days"
  ) {
    badgeClass =
      "bg-red-50 text-red-700";
  } else if (
    result.alertLevel === "15_days"
  ) {
    badgeClass =
      "bg-orange-50 text-orange-700";
  } else if (
    result.alertLevel === "30_days"
  ) {
    badgeClass =
      "bg-amber-50 text-amber-700";
  } else if (
    result.status === "no_expiry"
  ) {
    badgeClass =
      "bg-slate-100 text-slate-700";
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}
    >
      {getExpiryLabel(result)}
    </span>
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

function EmptyState() {
  return (
    <div className="px-4 py-10 text-center">
      <Files
        size={28}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm text-(--text-muted)">
        No documents found.
      </p>
    </div>
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
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted) sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-(--text) sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            {subtitle}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary) sm:h-11 sm:w-11">
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

function formatDate(
  date?: string
): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(`${date}T00:00:00`)
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";