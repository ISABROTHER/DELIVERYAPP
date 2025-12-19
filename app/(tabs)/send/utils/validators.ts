export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\s+/g, '');
  return /^\+?47\d{8}$/.test(cleaned) || /^\d{8}$/.test(cleaned);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePostalCode = (postalCode: string): boolean => {
  return /^\d{4}$/.test(postalCode);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 3;
};
