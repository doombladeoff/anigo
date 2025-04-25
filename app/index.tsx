import { ThemedView } from "@/components/ThemedView";
import { useEffect } from "react";
import { storage } from "@/utils/storage";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {

    const isSkip = storage.getSkip();
    const { setUser} = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setUser(user);
            if (user || isSkip) {
                router.replace({pathname: '/(tabs)/(home)', params: {animT: 'none'}});
            } else {
                router.replace('/(auth)');
            }
        });

        return unsubscribe;
    }, []);

    return <ThemedView style={{flex: 1}}/>;
}