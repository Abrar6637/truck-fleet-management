"use client";

import { companySettings } from "@/data/settings";
import { CompanySettings } from "@/types/settings";
import {
  Bell,
  Building2,
  CheckCircle2,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { FormEvent, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] =
    useState<CompanySettings>({
      ...companySettings,
    });

  const [saved, setSaved] =
    useState(false);

  function updateField<
    K extends keyof CompanySettings
  >(
    field: K,
    value: CompanySettings[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Frontend mock only.
    // Laravel API will save settings later.
    console.log("Settings:", form);

    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-7"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
            Settings
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-(--text-muted)">
            Manage company information,
            operational defaults and
            notification preferences.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-auto"
        >
          <Settings size={17} />
          Save Settings
        </button>
      </div>

      {/* Saved Message */}
      {saved && (
        <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>
            Settings updated in frontend
            mock state.
          </span>
        </div>
      )}

      {/* Company Information */}
      <section className={sectionClass}>
        <SectionHeader
          icon={Building2}
          title="Company Information"
          description="Basic fleet company contact information."
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2">
          <Field label="Company Name">
            <input
              value={form.companyName}
              onChange={(event) =>
                updateField(
                  "companyName",
                  event.target.value
                )
              }
              className={inputClass}
              required
            />
          </Field>

          <Field label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
              className={inputClass}
              required
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
              className={inputClass}
              required
            />
          </Field>

          <Field label="Address">
            <input
              value={form.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              className={inputClass}
              required
            />
          </Field>
        </div>
      </section>

      {/* Operational Defaults */}
      <section className={sectionClass}>
        <SectionHeader
          icon={SlidersHorizontal}
          title="Operational Defaults"
          description="Default values used across fleet operations."
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          <Field label="Currency">
            <select
              value={form.currency}
              disabled
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-(--text-muted)`}
            >
              <option value="PKR">
                PKR
              </option>
            </select>
          </Field>

          <Field label="Timezone">
            <select
              value={form.timezone}
              onChange={(event) =>
                updateField(
                  "timezone",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="Asia/Karachi">
                Asia/Karachi
              </option>
            </select>
          </Field>

          <Field label="Odometer Unit">
            <select
              value={form.odometerUnit}
              disabled
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-(--text-muted)`}
            >
              <option value="km">
                Kilometres (km)
              </option>
            </select>
          </Field>

          <Field label="Default Fuel Price / Litre">
            <input
              type="number"
              min="0"
              step="0.01"
              value={
                form.defaultFuelPricePerLitre ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "defaultFuelPricePerLitre",
                  event.target.value === ""
                    ? undefined
                    : Number(
                        event.target.value
                      )
                )
              }
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Alert Rules */}
      <section className={sectionClass}>
        <SectionHeader
          icon={Bell}
          title="Alert Rules"
          description="Configure how early important fleet reminders should appear."
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-5 md:grid-cols-3">
          <NumberField
            label="Document Expiry Alert"
            value={
              form.documentExpiryAlertDays
            }
            suffix="days before expiry"
            onChange={(value) =>
              updateField(
                "documentExpiryAlertDays",
                value
              )
            }
          />

          <NumberField
            label="Driver License Expiry"
            value={
              form.licenseExpiryAlertDays
            }
            suffix="days before expiry"
            onChange={(value) =>
              updateField(
                "licenseExpiryAlertDays",
                value
              )
            }
          />

          <NumberField
            label="Maintenance Reminder"
            value={
              form.maintenanceAlertDays
            }
            suffix="days before service"
            onChange={(value) =>
              updateField(
                "maintenanceAlertDays",
                value
              )
            }
          />
        </div>
      </section>

      {/* Notifications */}
      <section className={sectionClass}>
        <SectionHeader
          icon={Bell}
          title="Notification Preferences"
          description="Choose which operational alerts should be enabled."
        />

        <div className="mt-5 divide-y divide-(--border)">
          <ToggleRow
            title="Document Expiry Notifications"
            description="Receive alerts when truck documents are approaching expiry."
            checked={
              form.enableDocumentExpiryNotifications
            }
            onChange={(value) =>
              updateField(
                "enableDocumentExpiryNotifications",
                value
              )
            }
          />

          <ToggleRow
            title="Driver License Notifications"
            description="Receive alerts when a driver's license is approaching expiry."
            checked={
              form.enableLicenseExpiryNotifications
            }
            onChange={(value) =>
              updateField(
                "enableLicenseExpiryNotifications",
                value
              )
            }
          />

          <ToggleRow
            title="Maintenance Notifications"
            description="Receive reminders for upcoming truck maintenance."
            checked={
              form.enableMaintenanceNotifications
            }
            onChange={(value) =>
              updateField(
                "enableMaintenanceNotifications",
                value
              )
            }
          />

          <ToggleRow
            title="Payment Notifications"
            description="Receive alerts for outstanding trip payments."
            checked={
              form.enablePaymentNotifications
            }
            onChange={(value) =>
              updateField(
                "enablePaymentNotifications",
                value
              )
            }
          />
        </div>
      </section>

      {/* Backend Notice */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-(--text)">
          Frontend Settings
        </p>

        <p className="mt-1 text-sm leading-6 text-(--text-muted)">
          Save Settings currently updates
          frontend state only. Laravel
          backend integration will store
          these values permanently in MySQL
          and apply them to notifications
          and operational rules.
        </p>
      </section>

      {/* Mobile Bottom Save */}
      <div className="sm:hidden">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
        >
          <Settings size={17} />
          Save Settings
        </button>
      </div>
    </form>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-(--border) pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <h3 className="break-words font-semibold text-(--text)">
          {title}
        </h3>

        <p className="mt-1 break-words text-sm leading-6 text-(--text-muted)">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>
        {label}
      </label>

      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>
        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) =>
          onChange(
            Math.max(
              0,
              Number(event.target.value)
            )
          )
        }
        className={inputClass}
      />

      <p className="mt-1.5 text-xs text-(--text-muted)">
        {suffix}
      </p>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 sm:items-center sm:gap-6">
      <div className="min-w-0">
        <p className="break-words text-sm font-semibold text-(--text)">
          {title}
        </p>

        <p className="mt-1 break-words text-sm leading-5 text-(--text-muted)">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition sm:mt-0 ${
          checked
            ? "bg-(--primary)"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

const sectionClass =
  "rounded-2xl border border-(--border) bg-white p-4 sm:p-5";

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full min-w-0 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";