import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext);

export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //memantau status login user
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    //fungsi register dan simpan data ke firestore
    const register = async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const placeHolderAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

            await setDoc(doc(db, 'users', uid), {
                name: name,
                email: email,
                photoURL: placeHolderAvatar,
                isOnline: true,
                pushToken: ""
            });
        } catch (error) {
            throw error;
        }
    };

    //fungsi login dan ubah status jadi online
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await updateDoc(doc(db, 'users', userCredential.user.uid), {
                isOnline: true
            });
        } catch (error) {
            throw error;
        }
    };

    //fungsi logout dan ubah status jadi offline
    const logout = async () => {
        try {
            if (user) {
                await updateDoc(doc(db, 'users', user.uid), {
                    isOnline: false
                });
            }
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout}} >
            {children}
        </AuthContext.Provider>
    );
}