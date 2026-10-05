import {
  ReportOption,
  ReportType,
} from "@/types/report";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  CircleDollarSign,
  CircleGauge,
  FileWarning,
  Fuel,
  ReceiptText,
  Truck,
  UserRound,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const reports: ReportOption[] = [
  {
    id: "trips",
    title: "Trip Report",
    description:
      "Analyze trips, routes, load weights, trip status and revenue.",
  },
  {
    id: "trucks",
    title: "Truck Report",
    description:
      "Review fleet vehicles, capacity, status and operational information.",
  },
  {
    id: "drivers",
    title: "Driver Report",
    description:
      "Review drivers, assignments, operational status and license information.",
  },
  {
    id: "fuel",
    title: "Fuel Report",
    description:
      "Analyze fuel consumption, quantities and fuel costs.",
  },
  {
    id: "expenses",
    title: "Expense Report",
    description:
      "Review trip expenses and company operating expenses.",
  },
  {
    id: "income",
    title: "Income Report",
    description:
      "Review trip revenue, received payments and outstanding balances.",
  },
  {
    id: "profit_loss",
    title: "Profit & Loss Report",
    description:
      "Compare fleet revenue against operating expenses and profitability.",
  },
  {
    id: "maintenance",
    title: "Maintenance Report",
    description:
      "Analyze truck maintenance history, services and maintenance costs.",
  },
  {
    id: "tyres",
    title: "Tyre Report",
    description:
      "Review tyre inventory, condition and fleet tyre information.",
  },
  {
    id: "salaries",
    title: "Driver Salary Report",
    description:
      "Review monthly driver payroll, payments and outstanding salaries.",
  },
  {
    id: "document_expiry",
    title: "Document Expiry Report",
    description:
      "Monitor expired and upcoming truck and driver document expiries.",
  },
];

const reportRoutes: Record<
  ReportType,
  string
> = {
  trips: "/admin/reports/trips",
  trucks: "/admin/reports/trucks",
  drivers: "/admin/reports/drivers",
  fuel: "/admin/reports/fuel",
  expenses: "/admin/reports/expenses",
  income: "/admin/reports/income",

  // Existing P&L page
  profit_loss:
    "/admin/finance/profit-loss",

  maintenance:
    "/admin/reports/maintenance",
  tyres: "/admin/reports/tyres",
  salaries: "/admin/reports/salaries",
  document_expiry:
    "/admin/reports/document-expiry",
};

const reportIcons: Record<
  ReportType,
  typeof BarChart3
> = {
  trips: Truck,
  trucks: CircleGauge,
  drivers: Users,
  fuel: Fuel,
  expenses: ReceiptText,
  income: CircleDollarSign,
  profit_loss: BarChart3,
  maintenance: Wrench,
  tyres: CircleGauge,
  salaries: WalletCards,
  document_expiry: FileWarning,
};

export default function ReportsPage() {
  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
          Reports & Analytics
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-(--text-muted)">
          Review operational, financial and
          compliance reports across your
          fleet.
        </p>
      </div>

      {/* Overview */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <SummaryCard
          label="Available Reports"
          value={String(reports.length)}
          icon={BarChart3}
        />

        <SummaryCard
          label="Financial Reports"
          value="4"
          icon={Banknote}
        />

        <SummaryCard
          label="Fleet & Compliance"
          value="7"
          icon={UserRound}
        />
      </section>

      {/* Report Center */}
      <section>
        <div className="mb-4 sm:mb-5">
          <h3 className="text-base font-semibold text-(--text) sm:text-lg">
            Report Center
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            Select a report to view detailed
            fleet information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {reports.map((report) => {
            const Icon =
              reportIcons[report.id];

            return (
              <Link
                key={report.id}
                href={
                  reportRoutes[report.id]
                }
                className="group flex min-w-0 flex-col rounded-2xl border border-(--border) bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm sm:p-5"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary) sm:h-11 sm:w-11">
                    <Icon size={20} />
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--text-muted) transition group-hover:bg-blue-50 group-hover:text-(--primary)">
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="mt-4 break-words font-semibold text-(--text) sm:mt-5">
                    {report.title}
                  </h4>

                  <p className="mt-2 break-words text-sm leading-6 text-(--text-muted)">
                    {report.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-(--border) pt-4 sm:mt-5">
                  <span className="text-sm font-semibold text-(--primary)">
                    View Report
                  </span>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-(--primary) transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Note */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-(--primary)">
            <BarChart3 size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-(--text)">
              Reports use existing fleet
              data
            </p>

            <p className="mt-1 text-sm leading-6 text-(--text-muted)">
              Reports will calculate and
              display data from trucks,
              drivers, trips, fuel, expenses,
              maintenance, salaries and
              documents. Separate duplicate
              report records are not
              required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-xs text-(--text-muted) sm:text-sm">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-(--text) sm:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary) sm:h-11 sm:w-11">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}