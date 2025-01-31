export type Flat = {
  _id?: string;
  title: string;
  price: number;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: [number, number];
  };
  type: "Apartment" | "House" | "Villa" | "Penthouse" | "Studio";
  images: { url: string; caption: string };
  amenities: [
    {
      type: string;
      enum: [
        "Parking",
        "Swimming Pool",
        "Gym",
        "Balcony",
        "Security",
        "Power Backup",
        "WiFi",
        "Garden"
      ];
    }
  ];
  bedrooms: number;
  bathrooms: number;
  area: number;
  owner: string;
  broker: string;
  availability: boolean;
  availabilityCalendar: [{ date: Date; available: boolean }];
  favoritesCount: number;
  createdAt?: Date;
};
