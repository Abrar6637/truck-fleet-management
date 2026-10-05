import { CompanySettings } from "@/types/settings";

export const companySettings: CompanySettings = {
  companyName: "Fleet Transport Company",
  phone: "+92 300 1234567",
  email: "admin@fleetmanagement.com",
  address: "Lahore, Punjab, Pakistan",

  currency: "PKR",
  timezone: "Asia/Karachi",

  defaultFuelPricePerLitre: 285,
  odometerUnit: "km",

  documentExpiryAlertDays: 30,
  maintenanceAlertDays: 7,
  licenseExpiryAlertDays: 30,

  enableDocumentExpiryNotifications: true,
  enableLicenseExpiryNotifications: true,
  enableMaintenanceNotifications: true,
  enablePaymentNotifications: true,
};