export type DocumentExpiryStatus =
  | "no_expiry"
  | "valid"
  | "expires_soon"
  | "expired";

export interface DocumentExpiryResult {
  status: DocumentExpiryStatus;
  daysRemaining: number | null;
  alertLevel: "none" | "30_days" | "15_days" | "7_days" | "expired";
}

export function getDocumentExpiryStatus(
  expiryDate?: string,
  currentDate: Date = new Date()
): DocumentExpiryResult {
  if (!expiryDate) {
    return {
      status: "no_expiry",
      daysRemaining: null,
      alertLevel: "none",
    };
  }

  const expiry = new Date(`${expiryDate}T00:00:00`);

  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const expiryDay = new Date(
    expiry.getFullYear(),
    expiry.getMonth(),
    expiry.getDate()
  );

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const daysRemaining = Math.ceil(
    (expiryDay.getTime() - today.getTime()) /
      millisecondsPerDay
  );

  if (daysRemaining < 0) {
    return {
      status: "expired",
      daysRemaining,
      alertLevel: "expired",
    };
  }

  if (daysRemaining <= 7) {
    return {
      status: "expires_soon",
      daysRemaining,
      alertLevel: "7_days",
    };
  }

  if (daysRemaining <= 15) {
    return {
      status: "expires_soon",
      daysRemaining,
      alertLevel: "15_days",
    };
  }

  if (daysRemaining <= 30) {
    return {
      status: "expires_soon",
      daysRemaining,
      alertLevel: "30_days",
    };
  }

  return {
    status: "valid",
    daysRemaining,
    alertLevel: "none",
  };
}

export function getExpiryLabel(
  result: DocumentExpiryResult
): string {
  if (result.status === "no_expiry") {
    return "No Expiry";
  }

  if (result.status === "expired") {
    const expiredDays = Math.abs(
      result.daysRemaining ?? 0
    );

    return expiredDays === 0
      ? "Expired"
      : `Expired ${expiredDays} day${
          expiredDays === 1 ? "" : "s"
        } ago`;
  }

  if (result.daysRemaining === 0) {
    return "Expires Today";
  }

  if (result.status === "expires_soon") {
    return `Expires in ${result.daysRemaining} day${
      result.daysRemaining === 1 ? "" : "s"
    }`;
  }

  return "Valid";
}