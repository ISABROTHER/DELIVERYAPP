export const PICKUP_FEE = 15;

export const calculateTotalPrice = (
  basePrice: number,
  pickupFee: number = 0
): number => {
  return basePrice + pickupFee;
};

export const formatPrice = (price: number): string => {
  return `GH₵${price.toFixed(2)}`;
};
