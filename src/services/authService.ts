import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/env';

export const GOOGLE_SIGN_IN_CANCELLED = 'Google sign-in was cancelled.';

const firebaseAuth = getAuth();

let confirmationResult: ConfirmationResult | null = null;

export function getConfirmationResult() {
  return confirmationResult;
}

export function clearConfirmationResult() {
  confirmationResult = null;
}

export async function sendOtp(phoneNumber: string): Promise<void> {
  try {
    confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber);
  } catch (error: any) {
    confirmationResult = null;
    console.error('[sendOtp] failed', {
      code: error?.code,
      message: error?.message,
    });

    switch (error.code) {
      case 'auth/invalid-phone-number':
        throw new Error('Please enter a valid phone number.');
      case 'auth/too-many-requests':
        throw new Error('Too many requests. Please try again later.');
      case 'auth/quota-exceeded':
        throw new Error('SMS quota exceeded. Please try again later.');
      case 'auth/operation-not-allowed':
        throw new Error(
          'Phone sign-in is blocked. Enable the Phone provider, allow your region in Authentication → Settings → SMS region policy, and link Cloud billing (SMS is unavailable on the Spark plan).'
        );
      case 'auth/billing-not-enabled':
        throw new Error('Phone sign-in is not enabled for this project. Check Firebase billing.');
      case 'auth/internal-error':
        throw new Error(
          'Authentication service error. Add your app SHA-1/SHA-256 fingerprints in Firebase Console.'
        );
      default:
        throw new Error('Failed to send OTP. Please try again.');
    }
  }
}

export async function verifyOtp(otpCode: string): Promise<string> {
  if (!confirmationResult) {
    throw new Error('No OTP request found. Please go back and try again.');
  }

  try {
    const credential = await confirmationResult.confirm(otpCode);
    if (!credential) {
      throw new Error('Failed to verify OTP. Please try again.');
    }
    const idToken = await getIdToken(credential.user);
    confirmationResult = null;
    return idToken;
  } catch (error: any) {
    console.error('[verifyOtp] failed', {
      code: error?.code,
      message: error?.message,
    });

    switch (error.code) {
      case 'auth/invalid-verification-code':
        throw new Error('Invalid OTP. Please try again.');
      case 'auth/session-expired':
        throw new Error('OTP expired. Please request a new one.');
      default:
        throw new Error('Failed to verify OTP. Please try again.');
    }
  }
}

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export async function signOutAuth(): Promise<void> {
  await Promise.allSettled([GoogleSignin.signOut(), signOut(firebaseAuth)]);
}

export async function signInWithGoogle(): Promise<string> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      throw new Error(GOOGLE_SIGN_IN_CANCELLED);
    }
    if (!response.data.idToken) {
      throw new Error('Google sign-in failed. Please try again.');
    }

    const { accessToken } = await GoogleSignin.getTokens();
    if (!accessToken) {
      throw new Error('Google sign-in failed: missing access token. Please try again.');
    }

    const googleCredential = GoogleAuthProvider.credential(
      response.data.idToken,
      accessToken
    );
    const userCredential = await signInWithCredential(firebaseAuth, googleCredential);
    return getIdToken(userCredential.user);
  } catch (error: any) {
    if (error?.message === GOOGLE_SIGN_IN_CANCELLED) {
      throw error;
    }
    if (error?.code === 'SIGN_IN_CANCELLED' || error?.code === '-5') {
      throw new Error(GOOGLE_SIGN_IN_CANCELLED);
    }
    if (error?.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      throw new Error('Google Play Services is unavailable. Please update or install it.');
    }
    if (error?.message) {
      throw error;
    }
    throw new Error('Google sign-in failed. Please try again.');
  }
}
