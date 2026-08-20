import { Platform } from 'react-native';

/**
 * Set this to your machine's LAN IP (e.g. '192.168.1.10') when testing on a
 * physical device. Leave empty to use the platform default.
 */
const DEV_API_HOST = '';

const DEFAULT_API_HOST =
  DEV_API_HOST || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

export const API_PORT = 3000;

export const API_BASE_URL = `http://${DEFAULT_API_HOST}:${API_PORT}/api/v1`;