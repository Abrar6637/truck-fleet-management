import { companyExpenses } from "@/data/companyExpenses";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  FileText,
  ReceiptText,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const categoryLabels = {
  office_rent: "Office Rent",
  office_utility: "Office Utility",
  staff_salary: "Staff Salary",
  insurance: "Insurance",
  tax: "Tax",
  software: "Software",
  legal: "Legal",
  marketing: "Marketing",
  bank_charge: "Bank Charge",
  miscellaneous: "Miscellaneous",
};

export default async function CompanyExpenseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const expense = companyExpenses.find(
    (item) => item.id === Number(id)
  );

  if (!expense) {
    notFound();
  }

  return (
    <div className="space-y-7">
      {/* Back */}
      <Link
        href="/admin/finance/expenses"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
      >
        <ArrowLeft size={17} />
        Back to Company Expenses
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-(--text)">
            {expense.title}
          </h2>

          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-(--primary)">
            {categoryLabels[expense.category]}
          </span>
        </div>

        <p className="mt-2 text-sm text-(--text-muted)">
          Company expense record #{expense.id}
        </p>
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Amount"
          value={formatCurrency(expense.amount)}
          icon={<Banknote size={19} />}
        />

        <SummaryCard
          label="Expense Date"
          value={formatDate(expense.expenseDate)}
          icon={<CalendarDays size={19} />}
        />

        <SummaryCard
          label="Payment Method"
          value={formatText(expense.paymentMethod)}
          icon={<ReceiptText size={19} />}
        />

        <SummaryCard
          label="Vendor / Payee"
          value={expense.vendorName ?? "Not specified"}
          icon={<Building2 size={19} />}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Expense Information */}
        <section className="rounded-2xl border border-(--border) bg-white">
          <SectionHeader
            title="Expense Information"
            description="General information about this expense."
            icon={<ReceiptText size={19} />}
          />

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <InfoItem
              label="Expense Title"
              value={expense.title}
            />

            <InfoItem
              label="Category"
              value={categoryLabels[expense.category]}
            />

            <InfoItem
              label="Amount"
              value={formatCurrency(expense.amount)}
            />

            <InfoItem
              label="Expense Date"
              value={formatDate(expense.expenseDate)}
            />
          </div>
        </section>

        {/* Payment Information */}
        <section className="rounded-2xl border border-(--border) bg-white">
          <SectionHeader
            title="Payment Information"
            description="Payment and transaction details."
            icon={<Banknote size={19} />}
          />

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <InfoItem
              label="Payment Method"
              value={formatText(expense.paymentMethod)}
            />

            <InfoItem
              label="Reference Number"
              value={expense.referenceNumber ?? "—"}
            />

            <InfoItem
              label="Vendor / Payee"
              value={expense.vendorName ?? "—"}
            />

            <InfoItem
              label="Recorded By"
              value={expense.createdBy}
            />
          </div>
        </section>
      </div>

      {/* Description */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          title="Description"
          description="Additional information about the expense."
          icon={<FileText size={19} />}
        />

        <div className="p-6">
          <p className="text-sm leading-7 text-(--text-muted)">
            {expense.description ??
              "No description was added for this expense."}
          </p>
        </div>
      </section>

      {/* Receipt */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          title="Receipt"
          description="Supporting receipt or expense document."
          icon={<FileText size={19} />}
        />

        <div className="p-6">
          {expense.receiptFileName ? (
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-(--border) bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-(--primary)">
                  <FileText size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-(--text)">
                    {expense.receiptFileName}
                  </p>

                  <p className="mt-1 text-xs text-(--text-muted)">
                    Expense receipt
                  </p>
                </div>
              </div>

              {expense.receiptFileUrl && (
                <a
                  href={expense.receiptFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-(--primary) hover:underline"
                >
                  View Receipt
                </a>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
              <FileText
                size={28}
                className="mx-auto text-(--text-muted)"
              />

              <p className="mt-3 text-sm font-medium text-(--text)">
                No receipt attached
              </p>

              <p className="mt-1 text-xs text-(--text-muted)">
                No supporting file is available for this expense.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Audit */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          title="Record Information"
          description="Basic audit information for this record."
          icon={<UserRound size={19} />}
        />

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <InfoItem
            label="Created By"
            value={expense.createdBy}
          />

          <InfoItem
            label="Created At"
            value={formatDateTime(expense.createdAt)}
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-(--text-muted)">
            {label}
          </p>

          <p className="mt-2 truncate text-lg font-bold text-(--text)">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
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
  );
}

function InfoItem({
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

      <p className="mt-1.5 text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
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