export interface CompanySettings {
  companyName: string;
  phone: string;
  email: string;
  address: string;

  currency: "PKR";
  timezone: string;

  defaultFuelPricePerLitre?: number;
  odometerUnit: "km";

  documentExpiryAlertDays: number;
  maintenanceAlertDays: number;
  licenseExpiryAlertDays: number;

  enableDocumentExpiryNotifications: boolean;
  enableLicenseExpiryNotifications: boolean;
  enableMaintenanceNotifications: boolean;
  enablePaymentNotifications: boolean;
}