import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  // @ts-expect-error Firebase 12 omite este export nativo das declarações públicas.
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';

function initializeFirebaseAuth() {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  const appName = 'parada-certa';
  const existingApp = getApps().find((app) => app.name === appName);

  if (existingApp) {
    return getAuth(existingApp);
  }

  const app = initializeApp({ apiKey, authDomain, projectId, appId }, appName);
  return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
}

export const firebaseAuth = initializeFirebaseAuth();
