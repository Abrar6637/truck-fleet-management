import { Trip } from "@/types/trip";

export const trips: Trip[] = [
  {
    id: 1,
    tripNumber: "TRP-1001",

    truckId: 1,
    driverId: 1,

    origin: "Lahore",
    destination: "Karachi",

    startDate: "2026-10-03",
    expectedDeliveryDate: "2026-10-05",

    goodsType: "General Cargo",
    goodsDescription: "Packaged commercial goods.",

    loadedWeightKg: 24000,

    pickupCompanyName: "ABC Logistics",
    pickupContactPerson: "Ahmed Raza",
    pickupPhone: "0300-1112233",
    pickupAddress: "Sundar Industrial Estate, Lahore",

    deliveryCompanyName: "DEF Traders",
    deliveryContactPerson: "Usman Khan",
    deliveryPhone: "0312-4455667",
    deliveryAddress: "SITE Industrial Area, Karachi",

    tripAmount: 185000,

    status: "in_transit",

    notes: "Handle cargo carefully.",
    createdBy: "Fleet Admin",
  },

  {
    id: 2,
    tripNumber: "TRP-1002",

    truckId: 2,
    driverId: 2,

    origin: "Lahore",
    destination: "Islamabad",

    startDate: "2026-10-04",
    expectedDeliveryDate: "2026-10-05",

    goodsType: "Construction Material",
    goodsDescription: "Building material shipment.",

    loadedWeightKg: 18000,

    pickupCompanyName: "Pak Construction Supplies",
    pickupContactPerson: "Hamza Ali",
    pickupPhone: "0301-2223344",
    pickupAddress: "Kot Lakhpat Industrial Area, Lahore",

    deliveryCompanyName: "Capital Builders",
    deliveryContactPerson: "Saad Ahmed",
    deliveryPhone: "0333-4455778",
    deliveryAddress: "I-9 Industrial Area, Islamabad",

    tripAmount: 95000,

    status: "started",

    createdBy: "Fleet Admin",
  },

  {
    id: 3,
    tripNumber: "TRP-1003",

    truckId: 3,
    driverId: 3,

    origin: "Faisalabad",
    destination: "Multan",

    startDate: "2026-10-04",
    expectedDeliveryDate: "2026-10-05",

    goodsType: "Textile",
    goodsDescription: "Finished textile products.",

    loadedWeightKg: 28000,

    pickupCompanyName: "Punjab Textiles Ltd",
    pickupContactPerson: "Bilal Hussain",
    pickupPhone: "0302-7788990",
    pickupAddress: "M3 Industrial City, Faisalabad",

    deliveryCompanyName: "Multan Garments",
    deliveryContactPerson: "Ali Hassan",
    deliveryPhone: "0321-6677889",
    deliveryAddress: "Industrial Estate, Multan",

    tripAmount: 120000,

    status: "in_transit",

    createdBy: "Fleet Admin",
  },

  {
    id: 4,
    tripNumber: "TRP-1004",

    truckId: 4,
    driverId: 4,

    origin: "Lahore",
    destination: "Gujranwala",

    startDate: "2026-09-27",
    expectedDeliveryDate: "2026-09-28",
    actualDeliveryDate: "2026-09-28",

    goodsType: "Industrial Equipment",
    goodsDescription: "Industrial machinery and equipment.",

    loadedWeightKg: 22000,

    pickupCompanyName: "National Engineering",
    pickupContactPerson: "Adeel Khan",
    pickupPhone: "0305-1234567",
    pickupAddress: "Quaid-e-Azam Industrial Estate, Lahore",

    deliveryCompanyName: "Gujranwala Engineering Works",
    deliveryContactPerson: "Hassan Javed",
    deliveryPhone: "0322-7654321",
    deliveryAddress: "Small Industrial Estate, Gujranwala",

    tripAmount: 85000,

    status: "completed",

    notes: "Delivery completed successfully.",
    createdBy: "Fleet Admin",
  },

  {
    id: 5,
    tripNumber: "TRP-1005",

    truckId: 6,
    driverId: 5,

    origin: "Lahore",
    destination: "Rawalpindi",

    startDate: "2026-09-20",
    expectedDeliveryDate: "2026-09-21",

    goodsType: "General Cargo",
    goodsDescription: "Commercial cargo shipment.",

    loadedWeightKg: 25000,

    pickupCompanyName: "Raza Enterprises",
    pickupContactPerson: "Imran Raza",
    pickupPhone: "0300-9876543",
    pickupAddress: "Badami Bagh, Lahore",

    deliveryCompanyName: "Rawalpindi Wholesale Traders",
    deliveryContactPerson: "Ahsan Malik",
    deliveryPhone: "0334-1122334",
    deliveryAddress: "IJP Road, Rawalpindi",

    tripAmount: 110000,

    status: "cancelled",

    notes: "Trip cancelled after truck breakdown.",
    createdBy: "Fleet Admin",
  },

  {
    id: 6,
    tripNumber: "TRP-1006",

    truckId: 2,
    driverId: 2,

    origin: "Islamabad",
    destination: "Lahore",

    startDate: "2026-10-08",
    expectedDeliveryDate: "2026-10-09",

    goodsType: "Electronics",
    goodsDescription: "Packaged electronic equipment.",

    loadedWeightKg: 15000,

    pickupCompanyName: "Tech Distribution Pakistan",
    pickupContactPerson: "Owais Ahmed",
    pickupPhone: "0315-8899001",
    pickupAddress: "I-10 Industrial Area, Islamabad",

    deliveryCompanyName: "Lahore Electronics Market",
    deliveryContactPerson: "Fahad Ali",
    deliveryPhone: "0307-5566778",
    deliveryAddress: "Hall Road, Lahore",

    tripAmount: 105000,

    status: "assigned",

    createdBy: "Fleet Admin",
  },
];