import { auth } from './firebase';

let confirmationResult: any = null;

export function getConfirmationResult() {
  return confirmationResult;
}

export function clearConfirmationResult() {
  confirmationResult = null;
}

export async function sendOtp(phoneNumber: string): Promise<void> {
  try {
    confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
  } catch (error: any) {
    confirmationResult = null;
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Please enter a valid phone number.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please try again later.');
    }
    if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please try again later.');
    }
    throw new Error('Failed to send OTP. Please try again.');
  }
}

export async function verifyOtp(otpCode: string): Promise<string> {
  if (!confirmationResult) {
    throw new Error('No OTP request found. Please go back and try again.');
  }

  try {
    const credential = await confirmationResult.confirm(otpCode);
    const idToken = await credential.user.getIdToken();
    return idToken;
  } catch (error: any) {
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Invalid OTP. Please try again.');
    }
    if (error.code === 'auth/session-expired') {
      throw new Error('OTP expired. Please request a new one.');
    }
    throw new Error('Failed to verify OTP. Please try again.');
  }
}
