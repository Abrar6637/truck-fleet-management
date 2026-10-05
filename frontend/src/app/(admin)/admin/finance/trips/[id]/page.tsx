import { tripPayments } from "@/data/tripPayments";
import { trips } from "@/data/trips";
import {
  calculateTripPayment,
  TripPaymentStatus,
} from "@/lib/tripPayment";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  CirclePlus,
  CreditCard,
  MapPin,
  ReceiptText,
  Truck,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusLabels: Record<TripPaymentStatus, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  paid: "Paid",
};

const statusClasses: Record<TripPaymentStatus, string> = {
  unpaid: "bg-red-50 text-red-700",
  partially_paid: "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
};

const paymentTypeLabels = {
  advance: "Advance",
  partial: "Partial",
  final: "Final",
};

const paymentMethodLabels = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  cheque: "Cheque",
  other: "Other",
};

export default async function TripPaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trip = trips.find(
    (item) => item.id === Number(id)
  );

  if (!trip) {
    notFound();
  }

  const payments = tripPayments
    .filter((payment) => payment.tripId === trip.id)
    .sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() -
        new Date(a.paymentDate).getTime()
    );

  const summary = calculateTripPayment(
    trip.id,
    trip.tripAmount,
    tripPayments
  );

  return (
    <div className="space-y-7">
      {/* Back */}
      <Link
        href="/admin/finance"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
      >
        <ArrowLeft size={17} />
        Back to Finance
      </Link>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-(--text)">
              {trip.tripNumber}
            </h2>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                statusClasses[summary.paymentStatus]
              }`}
            >
              {statusLabels[summary.paymentStatus]}
            </span>
          </div>

          <p className="mt-2 text-sm text-(--text-muted)">
            {trip.origin} → {trip.destination}
          </p>
        </div>

        {summary.remainingAmount > 0 &&
          trip.status !== "cancelled" && (
            <Link
              href={`/admin/finance/trips/${trip.id}/payment`}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
            >
              <CirclePlus size={17} />
              Record Payment
            </Link>
          )}
      </div>

      {/* Financial Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Trip Amount"
          value={formatCurrency(summary.tripAmount)}
          icon={WalletCards}
        />

        <SummaryCard
          title="Received"
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

      {/* Trip Information */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          icon={<Truck size={19} />}
          title="Trip Information"
          description="Trip and customer payment context."
        />

        <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem
            icon={<MapPin size={16} />}
            label="Route"
            value={`${trip.origin} → ${trip.destination}`}
          />

          <InfoItem
            icon={<Building2 size={16} />}
            label="Pickup Company"
            value={trip.pickupCompanyName}
          />

          <InfoItem
            icon={<Building2 size={16} />}
            label="Delivery Company"
            value={trip.deliveryCompanyName}
          />

          <InfoItem
            icon={<CalendarDays size={16} />}
            label="Start Date"
            value={formatDate(trip.startDate)}
          />
        </div>

        <div className="border-t border-(--border) px-6 py-4">
          <Link
            href={`/admin/trips/${trip.id}`}
            className="text-sm font-semibold text-(--primary) hover:underline"
          >
            View Complete Trip Details
          </Link>
        </div>
      </section>

      {/* Payment Progress */}
      <section className="rounded-2xl border border-(--border) bg-white p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-(--text)">
              Payment Progress
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              {formatCurrency(summary.paidAmount)} of{" "}
              {formatCurrency(summary.tripAmount)} received.
            </p>
          </div>

          <p className="text-lg font-bold text-(--text)">
            {getPaymentPercentage(
              summary.paidAmount,
              summary.tripAmount
            ).toFixed(0)}
            %
          </p>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-(--primary) transition-all"
            style={{
              width: `${Math.min(
                100,
                getPaymentPercentage(
                  summary.paidAmount,
                  summary.tripAmount
                )
              )}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm">
          <span className="text-(--text-muted)">
            Received:{" "}
            <strong className="text-green-700">
              {formatCurrency(summary.paidAmount)}
            </strong>
          </span>

          <span className="text-(--text-muted)">
            Outstanding:{" "}
            <strong
              className={
                summary.remainingAmount > 0
                  ? "text-(--danger)"
                  : "text-green-700"
              }
            >
              {formatCurrency(summary.remainingAmount)}
            </strong>
          </span>
        </div>
      </section>

      {/* Payment History */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <SectionHeader
          icon={<ReceiptText size={19} />}
          title="Payment History"
          description="All payments recorded against this trip."
        />

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-(--border) bg-slate-50">
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
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
                      {formatDate(payment.paymentDate)}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-(--primary)">
                        {
                          paymentTypeLabels[
                            payment.paymentType
                          ]
                        }
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-green-700">
                        {formatCurrency(payment.amount)}
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
                      {payment.referenceNumber ?? "—"}
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
              No payment has been received for this trip.
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

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-(--text-muted)">
        {icon}

        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-semibold text-(--text)">
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getPaymentPercentage(
  paidAmount: number,
  tripAmount: number
) {
  if (tripAmount <= 0) {
    return 100;
  }

  return (paidAmount / tripAmount) * 100;
}