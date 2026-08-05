export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.replace(/[^0-9]/g, ''));
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode.replace(/[^0-9]/g, ''));
}
