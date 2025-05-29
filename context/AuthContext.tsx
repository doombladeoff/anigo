import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { YummyAPI } from '@/api/Yummy';

export interface CustomUser extends User {
    avatarURL: string;
    lastAnime: number;
    lastAnimePoster: string;
    lastEpisode: string;
    yummyToken: string;
    yummyTokenDate: string;
}

type AuthContextType = {
    user: CustomUser | null;
    setUser: (user: CustomUser | null) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
});

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
                async (docSnapshot) => {
                    if (!docSnapshot.exists()) return;

                    const userData = docSnapshot.data() as CustomUser;

                    const tokenDocRef = doc(db, 'yummy-tokens', 'tokenData');
                    const tokenDoc = await getDoc(tokenDocRef);

                    let yummyToken = '';
                    let yummyTokenDate = '';

                    if (tokenDoc.exists()) {
                        const tokenData = tokenDoc.data();
                        yummyToken = tokenData.token;
                        yummyTokenDate = tokenData.date;

                        if (tokenData) {
                            const now = Date.now();
                            const tokenDateMs = new Date(yummyTokenDate).getTime();
                            if (!isNaN(tokenDateMs) && now - tokenDateMs < TWO_DAYS_MS) {
                                console.log('Токен действителен')
                            } else {
                                console.log('Refresh_YummyAPI_Token...');
                                await YummyAPI.auth.refreshToken(yummyToken);
                            }
                        } else {
                            console.log('Login to Yummuy API ...');
                            await YummyAPI.auth.login();
                        }
                    }

                    setUser({
                        ...userData,
                        yummyToken,
                        yummyTokenDate,
                    });

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
        <AuthContext.Provider value={{ user, setUser }}>
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