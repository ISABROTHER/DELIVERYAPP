export type DeliveryMethod = {
  id: string;
  label: string;
  description: string;
  additionalCost: number;
};

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'self',
    label: 'Deliver self',
    description: 'Bring your parcel to a post office or drop-off point',
    additionalCost: 0,
  },
  {
    id: 'mailbox',
    label: 'Send from own mailbox',
    description: "We'll pick up the parcel from your mailbox",
    additionalCost: 9,
  },
];
