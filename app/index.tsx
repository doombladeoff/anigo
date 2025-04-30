import { useEffect, useState } from "react";
import { storage } from "@/utils/storage";
import { CustomUser, useAuth } from "@/context/AuthContext";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 500,
    fade: true,
});

export default function App() {
    const isSkip = storage.getSkip();
    const {setUser} = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        SplashScreen.hide();

        if (isSkip) {
            router.replace('/(tabs)/(home)');
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user as CustomUser);
                router.replace('/(tabs)/(home)');
            } else {
                router.replace('/(auth)');
            }
        });

        return unsubscribe;
    }, [isMounted]);

    return null;
}
