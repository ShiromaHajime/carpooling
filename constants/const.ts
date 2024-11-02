// http://192.168.0.176:5000 es mi ip local harcodeada, probablemente la tuya sea otra.
// Lo ideal es poner en un archivo .env en la raiz del proyecto la ip de la api rest

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// archivo .env que tiene las variables de entorno
// EXPO_PUBLIC_API_URL = https://dscarpooling-back.alwaysdata.net
//

export const API_URL = process.env.EXPO_PUBLIC_LOCAL_API_URL ?? 'https://carpooling-backend.alwaysdata.net/'
export const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_LOCAL_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_LOCAL_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_LOCAL_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_LOCAL_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_LOCAL_MESSAGIN_SENDERID,
    appId: process.env.EXPO_PUBLIC_LOCAL_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_LOCAL_MEASUREMENT_ID
};
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
}); export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
