import {
  driverSalaries,
  driverSalaryPayments,
} from "@/data/driverSalaries";
import { drivers } from "@/data/drivers";
import { calculateDriverSalary } from "@/lib/driverSalary";
import { DriverSalaryStatus } from "@/types/driverSalary";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CirclePlus,
  CreditCard,
  ReceiptText,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusLabels: Record<DriverSalaryStatus, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  paid: "Paid",
};

const statusClasses: Record<DriverSalaryStatus, string> = {
  unpaid: "bg-red-50 text-red-700",
  partially_paid: "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
};

const paymentMethodLabels = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  other: "Other",
};

export default async function SalaryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const salary = driverSalaries.find(
    (item) => item.id === Number(id)
  );

  if (!salary) {
    notFound();
  }

  const driver = drivers.find(
    (item) => item.id === salary.driverId
  );

  const payments = driverSalaryPayments
    .filter(
      (payment) =>
        payment.driverSalaryId === salary.id
    )
    .sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() -
        new Date(a.paymentDate).getTime()
    );

  const summary = calculateDriverSalary(
    salary,
    driverSalaryPayments
  );

  return (
    <div className="space-y-7">
      {/* Back */}
      <Link
        href="/admin/salaries"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
      >
        <ArrowLeft size={17} />
        Back to Salaries
      </Link>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-(--text)">
              {driver?.name ?? "Unknown Driver"}
            </h2>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                statusClasses[summary.status]
              }`}
            >
              {statusLabels[summary.status]}
            </span>
          </div>

          <p className="mt-2 text-sm text-(--text-muted)">
            Salary for{" "}
            {formatSalaryMonth(salary.salaryMonth)}
          </p>
        </div>

        {summary.remainingAmount > 0 && (
          <Link
            href={`/admin/salaries/${salary.id}/payment`}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <CirclePlus size={17} />
            Record Payment
          </Link>
        )}
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Net Salary"
          value={formatCurrency(summary.netSalary)}
          icon={WalletCards}
        />

        <SummaryCard
          title="Paid Amount"
          value={formatCurrency(summary.paidAmount)}
          icon={Banknote}
        />

        <SummaryCard
          title="Remaining"
          value={formatCurrency(summary.remainingAmount)}
          icon={CreditCard}
        />

        <SummaryCard
          title="Payments"
          value={String(payments.length)}
          icon={ReceiptText}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Salary Breakdown */}
        <section className="rounded-2xl border border-(--border) bg-white xl:col-span-2">
          <SectionHeader
            icon={<WalletCards size={19} />}
            title="Salary Breakdown"
            description="Monthly salary calculation."
          />

          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <AmountRow
                label="Basic Salary"
                value={salary.basicSalary}
              />

              <AmountRow
                label="Trip Allowance"
                value={salary.tripAllowance}
              />

              <AmountRow
                label="Bonus"
                value={salary.bonus}
              />

              <AmountRow
                label="Gross Salary"
                value={summary.grossSalary}
                strong
              />

              <AmountRow
                label="Deductions"
                value={salary.deductions}
                danger={salary.deductions > 0}
              />

              <AmountRow
                label="Net Salary"
                value={summary.netSalary}
                strong
              />
            </div>

            <div className="mt-6 border-t border-(--border) pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-(--text)">
                  Remaining Balance
                </span>

                <span
                  className={`text-xl font-bold ${
                    summary.remainingAmount > 0
                      ? "text-(--danger)"
                      : "text-green-700"
                  }`}
                >
                  {formatCurrency(
                    summary.remainingAmount
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Driver */}
        <section className="rounded-2xl border border-(--border) bg-white">
          <SectionHeader
            icon={<UserRound size={19} />}
            title="Driver"
            description="Salary record owner."
          />

          <div className="space-y-4 p-6">
            {driver ? (
              <>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Name
                  </p>

                  <Link
                    href={`/admin/drivers/${driver.id}`}
                    className="mt-1 inline-block font-semibold text-(--text) hover:text-(--primary)"
                  >
                    {driver.name}
                  </Link>
                </div>

                <InfoRow
                  label="Phone"
                  value={driver.phone}
                />

                <InfoRow
                  label="Driver Status"
                  value={formatStatus(driver.status)}
                />
              </>
            ) : (
              <p className="text-sm text-(--text-muted)">
                Driver information unavailable.
              </p>
            )}

            <InfoRow
              label="Salary Month"
              value={formatSalaryMonth(
                salary.salaryMonth
              )}
            />

            <InfoRow
              label="Created By"
              value={salary.createdBy}
            />
          </div>
        </section>
      </div>

      {/* Notes */}
      {salary.notes && (
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <h3 className="font-semibold text-(--text)">
            Notes
          </h3>

          <p className="mt-2 text-sm leading-6 text-(--text-muted)">
            {salary.notes}
          </p>
        </section>
      )}

      {/* Payment History */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          icon={<ReceiptText size={19} />}
          title="Payment History"
          description="All payments recorded against this salary."
        />

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-(--border) bg-slate-50">
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Recorded By</TableHead>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-(--border) last:border-0"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {formatDate(
                          payment.paymentDate
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-green-700">
                        {formatCurrency(
                          payment.amount
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      {
                        paymentMethodLabels[
                          payment.paymentMethod
                        ]
                      }
                    </TableCell>

                    <TableCell>
                      {payment.referenceNumber ??
                        "—"}
                    </TableCell>

                    <TableCell>
                      {payment.notes ?? "—"}
                    </TableCell>

                    <TableCell>
                      {payment.createdBy}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Banknote
              size={30}
              className="mx-auto text-(--text-muted)"
            />

            <p className="mt-3 font-medium text-(--text)">
              No payments recorded
            </p>

            <p className="mt-1 text-sm text-(--text-muted)">
              This salary is currently unpaid.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof Banknote;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-(--text-muted)">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-(--text)">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
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

function AmountRow({
  label,
  value,
  strong = false,
  danger = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-(--text-muted)">
        {label}
      </p>

      <p
        className={`mt-1 ${
          strong ? "text-lg font-bold" : "font-semibold"
        } ${
          danger
            ? "text-(--danger)"
            : "text-(--text)"
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function InfoRow({
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

      <p className="mt-1 text-sm font-medium text-(--text)">
        {value}
      </p>
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSalaryMonth(month: string) {
  const [year, monthNumber] = month.split("-");

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(
    new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    )
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}