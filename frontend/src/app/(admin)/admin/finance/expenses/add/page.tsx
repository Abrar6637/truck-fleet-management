"use client";

import {
  CompanyExpenseCategory,
  CompanyExpensePaymentMethod,
} from "@/types/companyExpense";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CircleDollarSign,
  FileText,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const categories: {
  value: CompanyExpenseCategory;
  label: string;
}[] = [
  { value: "office_rent", label: "Office Rent" },
  { value: "office_utility", label: "Office Utility" },
  { value: "staff_salary", label: "Staff Salary" },
  { value: "insurance", label: "Insurance" },
  { value: "tax", label: "Tax" },
  { value: "software", label: "Software" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "bank_charge", label: "Bank Charge" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

const paymentMethods: {
  value: CompanyExpensePaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "easypaisa", label: "Easypaisa" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export default function AddCompanyExpensePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<CompanyExpenseCategory>("office_rent");

  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<CompanyExpensePaymentMethod>("cash");

  const [receiptFileName, setReceiptFileName] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const expenseAmount = Number(amount);

    if (!title.trim()) {
      setError("Please enter the expense title.");
      return;
    }

    if (
      !Number.isFinite(expenseAmount) ||
      expenseAmount <= 0
    ) {
      setError(
        "Expense amount must be greater than zero."
      );
      return;
    }

    if (!expenseDate) {
      setError("Please select the expense date.");
      return;
    }

    const formData = new FormData(
      event.currentTarget
    );

    const vendorName = String(
      formData.get("vendorName") ?? ""
    ).trim();

    setSuccess(
      `${title.trim()} expense of ${formatCurrency(
        expenseAmount
      )} is valid and ready to save.${
        vendorName
          ? ` Vendor: ${vendorName}.`
          : ""
      } It will be stored when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/finance/expenses"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Company Expenses
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Add Company Expense
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Record a company-level fleet operating expense.
        </p>
      </div>

      {/* Warning */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-800">
          Avoid duplicate expenses
        </p>

        <p className="mt-1 text-sm leading-6 text-amber-700">
          Do not enter truck fuel, trip expenses,
          maintenance or driver salaries here. Those
          expenses are already managed in their own modules.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <FormSection
          title="Expense Information"
          description="Enter the main expense details."
          icon={<ReceiptText size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Expense Title" required>
              <input
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="e.g. October Office Rent"
                className={inputClass}
              />
            </Field>

            <Field label="Category" required>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target
                      .value as CompanyExpenseCategory
                  )
                }
                className={inputClass}
              >
                {categories.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Amount" required>
              <div className="relative">
                <CircleDollarSign
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter amount"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="Expense Date" required>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  type="date"
                  value={expenseDate}
                  onChange={(event) => {
                    setExpenseDate(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          </div>
        </FormSection>

        {/* Payment */}
        <FormSection
          title="Payment Details"
          description="Record how the expense was paid."
          icon={<Building2 size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Payment Method" required>
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target
                      .value as CompanyExpensePaymentMethod
                  )
                }
                className={inputClass}
              >
                {paymentMethods.map((method) => (
                  <option
                    key={method.value}
                    value={method.value}
                  >
                    {method.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Vendor / Payee">
              <input
                type="text"
                name="vendorName"
                placeholder="e.g. Property Owner"
                className={inputClass}
              />
            </Field>

            <Field label="Reference Number">
              <input
                type="text"
                name="referenceNumber"
                placeholder="Transaction / cheque reference"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Receipt */}
        <FormSection
          title="Receipt"
          description="Attach an optional expense receipt."
          icon={<FileText size={19} />}
        >
          <Field label="Receipt File">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(event) =>
                setReceiptFileName(
                  event.target.files?.[0]?.name ?? ""
                )
              }
              className="block w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-(--primary)"
            />

            {receiptFileName && (
              <p className="mt-2 text-xs text-(--text-muted)">
                Selected: {receiptFileName}
              </p>
            )}
          </Field>
        </FormSection>

        {/* Description */}
        <FormSection
          title="Additional Information"
          description="Add optional details about this expense."
          icon={<ReceiptText size={19} />}
        >
          <Field label="Description">
            <textarea
              name="description"
              rows={4}
              placeholder="Enter expense details..."
              className={inputClass}
            />
          </Field>
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
            href="/admin/finance/expenses"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <ReceiptText size={17} />
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}

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
          <span className="ml-1 text-(--danger)">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";