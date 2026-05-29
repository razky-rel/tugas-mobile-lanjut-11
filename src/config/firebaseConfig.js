import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyARc1GS7wMn7v6dd_YMTliwdg7dEq9wpyA",
    authDomain: "mobile-lanjut-11.firebaseapp.com",
    projectId: "mobile-lanjut-11",
    StorageBucket: "mobile-lanjut-11.firebasestorage.app",
    messagingSenderId: "868357140977",
    appId: "1:868357140977:web:1670eb0b34ae1fa9c99450",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);