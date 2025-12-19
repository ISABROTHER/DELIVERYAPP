export type ParcelSize = {
  id: string;
  label: string;
  dimensions: string;
  price: number;
  maxWeight: number;
};

export const parcelSizes: ParcelSize[] = [
  {
    id: 'small',
    label: 'Norgespakke™ small',
    dimensions: '35 × 25 × 12 cm',
    price: 73,
    maxWeight: 5,
  },
  {
    id: 'medium',
    label: 'Norgespakke™ medium',
    dimensions: '120 × 60 × 60 cm',
    price: 120,
    maxWeight: 10,
  },
  {
    id: 'large',
    label: 'Norgespakke™ large',
    dimensions: '120 × 60 × 60 cm',
    price: 180,
    maxWeight: 25,
  },
  {
    id: 'xlarge',
    label: 'Norgespakke™ extra large',
    dimensions: '120 × 60 × 60 cm',
    price: 240,
    maxWeight: 35,
  },
];
