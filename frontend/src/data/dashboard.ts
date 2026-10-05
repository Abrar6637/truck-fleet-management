export const dashboardStats = {
  totalTrucks: 24,
  activeTrips: 8,
  totalDrivers: 21,
  monthlyRevenue: 2450000,
};

export const fleetStatus = [
  {
    label: "Available",
    value: 9,
  },
  {
    label: "On Trip",
    value: 8,
  },
  {
    label: "Maintenance",
    value: 4,
  },
  {
    label: "Breakdown",
    value: 1,
  },
  {
    label: "Inactive",
    value: 2,
  },
];

export const activeTrips = [
  {
    id: 1,
    tripNumber: "TRP-1001",
    truck: "LEC-4582",
    driver: "Ahmed Khan",
    origin: "Lahore",
    destination: "Karachi",
    loadedWeightKg: 24000,
    capacityKg: 30000,
    status: "In Transit",
  },
  {
    id: 2,
    tripNumber: "TRP-1002",
    truck: "LES-9214",
    driver: "Usman Ali",
    origin: "Lahore",
    destination: "Islamabad",
    loadedWeightKg: 18000,
    capacityKg: 25000,
    status: "Started",
  },
  {
    id: 3,
    tripNumber: "TRP-1003",
    truck: "LHR-6731",
    driver: "Bilal Ahmad",
    origin: "Faisalabad",
    destination: "Multan",
    loadedWeightKg: 28000,
    capacityKg: 32000,
    status: "In Transit",
  },
];

export const dashboardAlerts = [
  {
    id: 1,
    title: "Insurance expiring soon",
    description: "Truck LEC-4582 insurance expires in 7 days.",
    type: "warning",
  },
  {
    id: 2,
    title: "Service due",
    description: "Truck LES-9214 requires scheduled maintenance.",
    type: "warning",
  },
  {
    id: 3,
    title: "Driver license expiring",
    description: "Ahmed Khan's driving license expires in 15 days.",
    type: "danger",
  },
];