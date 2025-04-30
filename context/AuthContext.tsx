import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export interface CustomUser extends User {
    avatarURL: string;
    lastAnime: number;
    lastAnimePoster: string;
    lastEpisode: string
}

type AuthContextType = {
    user: CustomUser | null;
    setUser: (user: CustomUser | null) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
});

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<CustomUser | null>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) {
                setUser(null);
                return;
            }
            const userDocRef = doc(db, 'user-collection', user.uid);
            const unsubscribeSnapshot = onSnapshot(
                userDocRef,
                (docSnapshot) => {
                    if (!docSnapshot.exists()) return;

                    const userData = docSnapshot.data() as CustomUser;
                    setUser(userData);

                },
                (error) => console.error("Ошибка при подписке на изменения документа:", error)
            );

            return () => {
                unsubscribeSnapshot();
            };
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};