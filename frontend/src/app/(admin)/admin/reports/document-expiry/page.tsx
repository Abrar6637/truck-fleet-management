"use client";

import { driverDocuments } from "@/data/driverDocuments";
import { drivers } from "@/data/drivers";
import { truckDocuments } from "@/data/truckDocuments";
import {
    exportReportToExcel,
    exportReportToPDF,
} from "@/lib/reportExport";
import { trucks } from "@/data/trucks";
import {
    AlertTriangle,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    FileText,
    Search,
    ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type OwnerFilter = "all" | "truck" | "driver";

type ExpiryStatus =
    | "no_expiry"
    | "valid"
    | "expires_soon"
    | "expired";

type ExpiryFilter = "all" | ExpiryStatus;

interface DocumentRow {
    id: string;
    documentId: number;
    ownerType: "truck" | "driver";
    ownerId: number;
    ownerName: string;
    documentType: string;
    documentNumber: string;
    expiryDate?: string;
    issuingAuthority?: string;
    verificationStatus:
    | "pending"
    | "verified"
    | "rejected";
    expiryStatus: ExpiryStatus;
}

const MOCK_TODAY = "2026-10-05";
const EXPIRY_WARNING_DAYS = 30;

export default function DocumentExpiryReportPage() {
    const [search, setSearch] = useState("");
    const [ownerFilter, setOwnerFilter] =
        useState<OwnerFilter>("all");
    const [expiryFilter, setExpiryFilter] =
        useState<ExpiryFilter>("all");

    const allDocuments = useMemo<DocumentRow[]>(() => {
        const truckRows: DocumentRow[] =
            truckDocuments.map((document) => {
                const truck = trucks.find(
                    (item) => item.id === document.truckId
                );

                return {
                    id: `truck-${document.id}`,
                    documentId: document.id,
                    ownerType: "truck",
                    ownerId: document.truckId,
                    ownerName:
                        truck?.registrationNumber ??
                        `Truck #${document.truckId}`,
                    documentType: document.documentType,
                    documentNumber: document.documentNumber,
                    expiryDate: document.expiryDate,
                    issuingAuthority:
                        document.issuingAuthority,
                    verificationStatus:
                        document.verificationStatus,
                    expiryStatus: getExpiryStatus(
                        document.expiryDate
                    ),
                };
            });

        const driverRows: DocumentRow[] =
            driverDocuments.map((document) => {
                const driver = drivers.find(
                    (item) => item.id === document.driverId
                );

                return {
                    id: `driver-${document.id}`,
                    documentId: document.id,
                    ownerType: "driver",
                    ownerId: document.driverId,
                    ownerName:
                        driver?.name ??
                        `Driver #${document.driverId}`,
                    documentType: document.documentType,
                    documentNumber: document.documentNumber,
                    expiryDate: document.expiryDate,
                    issuingAuthority:
                        document.issuingAuthority,
                    verificationStatus:
                        document.verificationStatus,
                    expiryStatus: getExpiryStatus(
                        document.expiryDate
                    ),
                };
            });

        return [...truckRows, ...driverRows];
    }, []);

    const reportRows = useMemo(() => {
        const query = search.trim().toLowerCase();

        return allDocuments
            .filter((document) => {
                const matchesSearch =
                    !query ||
                    [
                        document.ownerName,
                        document.documentType,
                        document.documentNumber,
                        document.issuingAuthority,
                        document.verificationStatus,
                    ]
                        .filter(Boolean)
                        .some((value) =>
                            String(value)
                                .toLowerCase()
                                .includes(query)
                        );

                const matchesOwner =
                    ownerFilter === "all" ||
                    document.ownerType === ownerFilter;

                const matchesExpiry =
                    expiryFilter === "all" ||
                    document.expiryStatus === expiryFilter;

                return (
                    matchesSearch &&
                    matchesOwner &&
                    matchesExpiry
                );
            })
            .sort((a, b) => {
                if (!a.expiryDate && !b.expiryDate) {
                    return 0;
                }

                if (!a.expiryDate) return 1;
                if (!b.expiryDate) return -1;

                return a.expiryDate.localeCompare(
                    b.expiryDate
                );
            });
    }, [
        allDocuments,
        search,
        ownerFilter,
        expiryFilter,
    ]);

    const expiredCount = reportRows.filter(
        (document) =>
            document.expiryStatus === "expired"
    ).length;

    const expiresSoonCount = reportRows.filter(
        (document) =>
            document.expiryStatus === "expires_soon"
    ).length;

    const validCount = reportRows.filter(
        (document) =>
            document.expiryStatus === "valid"
    ).length;

    const noExpiryCount = reportRows.filter(
        (document) =>
            document.expiryStatus === "no_expiry"
    ).length;
    const exportColumns = [
        {
            header: "Owner",
            value: (row: DocumentRow) =>
                row.ownerName,
        },
        {
            header: "Owner Type",
            value: (row: DocumentRow) =>
                formatText(row.ownerType),
        },
        {
            header: "Document Type",
            value: (row: DocumentRow) =>
                formatText(row.documentType),
        },
        {
            header: "Document Number",
            value: (row: DocumentRow) =>
                row.documentNumber,
        },
        {
            header: "Issuing Authority",
            value: (row: DocumentRow) =>
                row.issuingAuthority ?? "—",
        },
        {
            header: "Verification",
            value: (row: DocumentRow) =>
                formatText(row.verificationStatus),
        },
        {
            header: "Expiry Date",
            value: (row: DocumentRow) =>
                row.expiryDate
                    ? formatDate(row.expiryDate)
                    : "No Expiry",
        },
        {
            header: "Expiry Status",
            value: (row: DocumentRow) =>
                formatText(row.expiryStatus),
        },
    ];

    const exportSummary = [
        {
            label: "Total Documents",
            value: reportRows.length,
        },
        {
            label: "Expired",
            value: expiredCount,
        },
        {
            label: "Expires Soon",
            value: expiresSoonCount,
        },
        {
            label: "Valid",
            value: validCount,
        },
        {
            label: "No Expiry",
            value: noExpiryCount,
        },
    ];

    function handlePDFExport() {
        exportReportToPDF({
            title: "Document Expiry Report",
            fileName: "document-expiry-report",
            columns: exportColumns,
            rows: reportRows,
            summary: exportSummary,
        });
    }

    function handleExcelExport() {
        exportReportToExcel({
            title: "Document Expiry Report",
            fileName: "document-expiry-report",
            columns: exportColumns,
            rows: reportRows,
            summary: exportSummary,
        });
    }

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-(--text)">
                        Document Expiry Report
                    </h2>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        Monitor truck and driver documents,
                        verification status and upcoming
                        expirations.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handlePDFExport}
                        disabled={reportRows.length === 0}
                        className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download size={17} />
                        Download PDF
                    </button>

                    <button
                        type="button"
                        onClick={handleExcelExport}
                        disabled={reportRows.length === 0}
                        className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FileSpreadsheet size={17} />
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            <section className="rounded-2xl border border-(--border) bg-white p-5">
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className={labelClass}>
                            Search
                        </label>

                        <div className="relative">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Owner, document, number..."
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Document Owner
                        </label>

                        <select
                            value={ownerFilter}
                            onChange={(event) =>
                                setOwnerFilter(
                                    event.target.value as OwnerFilter
                                )
                            }
                            className={inputClass}
                        >
                            <option value="all">
                                All Owners
                            </option>

                            <option value="truck">
                                Truck Documents
                            </option>

                            <option value="driver">
                                Driver Documents
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Expiry Status
                        </label>

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
                                All Expiry Statuses
                            </option>

                            <option value="expired">
                                Expired
                            </option>

                            <option value="expires_soon">
                                Expires Soon
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
            </section>

            {/* Summary */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Expired"
                    value={String(expiredCount)}
                    subtitle="Requires immediate attention"
                    icon={ShieldAlert}
                />

                <SummaryCard
                    label="Expires Soon"
                    value={String(expiresSoonCount)}
                    subtitle={`Within ${EXPIRY_WARNING_DAYS} days`}
                    icon={AlertTriangle}
                />

                <SummaryCard
                    label="Valid"
                    value={String(validCount)}
                    subtitle="Currently valid documents"
                    icon={CheckCircle2}
                />

                <SummaryCard
                    label="No Expiry"
                    value={String(noExpiryCount)}
                    subtitle="No expiry date recorded"
                    icon={FileText}
                />
            </section>

            {/* Information */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-medium text-(--text)">
                    Expiry and verification are separate
                    document states.
                </p>

                <p className="mt-1 text-sm text-(--text-muted)">
                    A document can be verified but expired,
                    or pending verification while still
                    within its expiry date. Documents are
                    marked &quot;Expires Soon&quot; when
                    their expiry date is within the next{" "}
                    {EXPIRY_WARNING_DAYS} days.
                </p>
            </section>

            {/* Table */}
            <section className="rounded-2xl border border-(--border) bg-white">
                <div className="border-b border-(--border) px-5 py-4">
                    <h3 className="font-semibold text-(--text)">
                        Document Records
                    </h3>

                    <p className="mt-1 text-sm text-(--text-muted)">
                        {reportRows.length} document
                        {reportRows.length === 1 ? "" : "s"}{" "}
                        found.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px]">
                        <thead>
                            <tr className="border-b border-(--border) bg-slate-50">
                                <TableHead>Owner</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>
                                    Document Number
                                </TableHead>
                                <TableHead>
                                    Issuing Authority
                                </TableHead>
                                <TableHead>
                                    Verification
                                </TableHead>
                                <TableHead>
                                    Expiry Date
                                </TableHead>
                                <TableHead>
                                    Expiry Status
                                </TableHead>
                                <TableHead>Action</TableHead>
                            </tr>
                        </thead>

                        <tbody>
                            {reportRows.map((document) => (
                                <tr
                                    key={document.id}
                                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                                >
                                    <TableCell>
                                        <div>
                                            <Link
                                                href={
                                                    document.ownerType ===
                                                        "truck"
                                                        ? `/admin/trucks/${document.ownerId}`
                                                        : `/admin/drivers/${document.ownerId}`
                                                }
                                                className="font-semibold text-(--primary) hover:underline"
                                            >
                                                {document.ownerName}
                                            </Link>

                                            <p className="mt-1 text-xs text-(--text-muted)">
                                                {document.ownerType ===
                                                    "truck"
                                                    ? "Truck"
                                                    : "Driver"}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {formatText(
                                            document.documentType
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-medium text-(--text)">
                                            {
                                                document.documentNumber
                                            }
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {document.issuingAuthority ??
                                            "—"}
                                    </TableCell>

                                    <TableCell>
                                        <VerificationBadge
                                            status={
                                                document.verificationStatus
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {document.expiryDate
                                            ? formatDate(
                                                document.expiryDate
                                            )
                                            : "—"}
                                    </TableCell>

                                    <TableCell>
                                        <ExpiryBadge
                                            status={
                                                document.expiryStatus
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Link
                                            href={
                                                document.ownerType ===
                                                    "truck"
                                                    ? `/admin/trucks/${document.ownerId}`
                                                    : `/admin/drivers/${document.ownerId}`
                                            }
                                            className="text-sm font-semibold text-(--primary) hover:underline"
                                        >
                                            View Owner
                                        </Link>
                                    </TableCell>
                                </tr>
                            ))}

                            {reportRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-12 text-center text-sm text-(--text-muted)"
                                    >
                                        No document records found for
                                        the selected filters.
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

function getExpiryStatus(
    expiryDate?: string
): ExpiryStatus {
    if (!expiryDate) {
        return "no_expiry";
    }

    const today = new Date(
        `${MOCK_TODAY}T00:00:00`
    );

    const expiry = new Date(
        `${expiryDate}T00:00:00`
    );

    if (expiry.getTime() < today.getTime()) {
        return "expired";
    }

    const warningDate = new Date(today);

    warningDate.setDate(
        warningDate.getDate() +
        EXPIRY_WARNING_DAYS
    );

    if (
        expiry.getTime() <=
        warningDate.getTime()
    ) {
        return "expires_soon";
    }

    return "valid";
}

function ExpiryBadge({
    status,
}: {
    status: ExpiryStatus;
}) {
    const styles = {
        expired:
            "bg-red-50 text-red-700",
        expires_soon:
            "bg-amber-50 text-amber-700",
        valid:
            "bg-green-50 text-green-700",
        no_expiry:
            "bg-slate-100 text-slate-700",
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {formatText(status)}
        </span>
    );
}

function VerificationBadge({
    status,
}: {
    status:
    | "pending"
    | "verified"
    | "rejected";
}) {
    const styles = {
        pending:
            "bg-amber-50 text-amber-700",
        verified:
            "bg-green-50 text-green-700",
        rejected:
            "bg-red-50 text-red-700",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {formatText(status)}
        </span>
    );
}

function SummaryCard({
    label,
    value,
    subtitle,
    icon: Icon,
}: {
    label: string;
    value: string;
    subtitle: string;
    icon: typeof FileText;
}) {
    return (
        <div className="rounded-2xl border border-(--border) bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-(--text-muted)">
                        {label}
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

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(
        new Date(`${value}T00:00:00`)
    );
}

function formatText(value: string) {
    return value
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

const labelClass =
    "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
    "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";