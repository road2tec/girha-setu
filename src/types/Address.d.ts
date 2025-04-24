export interface Address {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  landmark?: string;
}
