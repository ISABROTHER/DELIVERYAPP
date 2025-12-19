import React, { createContext, useContext, useState, ReactNode } from 'react';
import { calculateTotalPrice } from '../config/pricing';

export type ParcelDetails = {
  size: 'small' | 'medium' | 'large';
  weightRange: string;
  category?: string;
};

export type Location = {
  region: string;
  cityTown: string;
  landmark?: string;
};

export type Route = {
  origin: Location;
  destination: Location;
};

export type HandoverMethod = 'DROPOFF' | 'PICKUP';

export type Handover = {
  method: HandoverMethod;
  pickupDetails?: { landmark: string; phone: string; timing: string };
};

export type SenderInfo = {
  name: string;
  phone: string;
  region: string;
  city: string;
  area: string;
  email: string;
};

export type RecipientInfo = {
  name: string;
  phone: string;
  region: string;
  city: string;
  area: string;
};

type SendParcelContextType = {
  parcel: ParcelDetails | null;
  route: Route | null;
  handover: Handover | null;
  sender: SenderInfo | null;
  recipient: RecipientInfo | null;
  currentStep: number;
  totalPrice: number;
  basePrice: number;
  pickupFee: number;
  updateParcel: (parcel: ParcelDetails) => void;
  updateRoute: (route: Route) => void;
  updateHandover: (handover: Handover) => void;
  updateSender: (sender: SenderInfo) => void;
  updateRecipient: (recipient: RecipientInfo) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
};

const SendParcelContext = createContext<SendParcelContextType | undefined>(undefined);

export const SendParcelProvider = ({ children }: { children: ReactNode }) => {
  const [parcel, setParcel] = useState<ParcelDetails | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [handover, setHandover] = useState<Handover | null>(null);
  const [sender, setSender] = useState<SenderInfo | null>(null);
  const [recipient, setRecipient] = useState<RecipientInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const basePrice = 25; // Simple fallback
  const pickupFee = handover?.method === 'PICKUP' ? 15 : 0;
  const totalPrice = calculateTotalPrice(basePrice, pickupFee);

  return (
    <SendParcelContext.Provider
      value={{
        parcel, route, handover, sender, recipient,
        currentStep, totalPrice, basePrice, pickupFee,
        updateParcel: setParcel,
        updateRoute: setRoute,
        updateHandover: setHandover,
        updateSender: setSender,
        updateRecipient: setRecipient,
        setCurrentStep,
        reset: () => { setParcel(null); setRoute(null); setHandover(null); setSender(null); setRecipient(null); setCurrentStep(1); },
      }}
    >
      {children}
    </SendParcelContext.Provider>
  );
};

export const useSendParcel = () => {
  const context = useContext(SendParcelContext);
  if (!context) throw new Error('useSendParcel must be used within SendParcelProvider');
  return context;
};