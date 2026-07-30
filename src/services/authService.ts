import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
    console.error('[sendOtp] Error code:', error.code, 'message:', error.message, 'nativeErrorCode:', error.nativeErrorCode, 'nativeErrorMessage:', error.nativeErrorMessage);
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Please enter a valid phone number.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please try again later.');
    }
    if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please try again later.');
    }
    if (error.code === 'auth/internal-error') {
      throw new Error('Authentication service error. Please ensure SHA fingerprints are configured in Firebase Console.');
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

GoogleSignin.configure({
  webClientId: '187235081190-voqpb9cki83t6ni62hoco6693k8v4ipr.apps.googleusercontent.com',
});

export async function signInWithGoogle(): Promise<string> {
  await GoogleSignin.hasPlayServices();
  const googleUser = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(googleUser.idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);
  const firebaseIdToken = await userCredential.user.getIdToken();
  return firebaseIdToken;
}
