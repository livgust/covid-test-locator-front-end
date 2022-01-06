export type Place = {
  id: number;
  googlePlaceId: string;
  name: string;
  vicinity: string;
  location: {
    lat: number;
    long: number;
  };
  reports: Report[];
};

export type Report = {
  id: number;
  placeId: number;
  created: string;
  available: boolean;
  type:
    | 'at-home rapid antigen test'
    | 'rapid antigen test'
    | 'rapid PCR test'
    | 'PCR test';
  validationCount: number;
  limit?: number;
  quantity?: 'S' | 'M' | 'L' | 'XL';
};
