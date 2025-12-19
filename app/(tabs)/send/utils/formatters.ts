export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('47')) {
    const number = cleaned.slice(2);
    return `+47 ${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5)}`.trim();
  }

  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`.trim();
  }

  return phone;
};

export const formatPostalCode = (postalCode: string): string => {
  return postalCode.replace(/\D/g, '').slice(0, 4);
};

export const normalizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('47')) {
    return `+${cleaned}`;
  }

  if (cleaned.length === 8) {
    return `+47${cleaned}`;
  }

  return phone;
};
