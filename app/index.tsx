import { useEffect } from "react";
import { storage } from "@/utils/storage";
import { CustomUser, useAuth } from "@/context/AuthContext";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";

export default function Index() {
    const isSkip = storage.getSkip();
    const {setUser} = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setUser(user as CustomUser);
            if (user || isSkip) {
                router.replace('/(tabs)/(home)');
            } else {
                router.replace('/(auth)');
            }
        });

        return unsubscribe;
    }, []);

    return <ThemedView style={{flex: 1}}/>;
}