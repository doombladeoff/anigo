import { useEffect, useCallback, useState } from 'react';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { uploadAvatar, updateUserAvatar } from "@/utils/firebase/changeAvatar";
import { addUser } from "@/utils/firebase/addUser";
import * as ImagePicker from 'expo-image-picker';
import { auth } from '@/lib/firebase';

export const useGoogleAuth = () => {
    const {setUser} = useAuth();
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [isLoadImage, setLoad] = useState(false);

    const [request, response, promptAsync] = useAuthRequest({
        selectAccount: true,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        redirectUri: makeRedirectUri({scheme: 'com.f0rever.anigo'}),
    });

    const handleAuthSuccess = useCallback(
        async (user: any, userData: any = {}) => {
            try {
                await addUser(user);
                setUser(userData);
                router.replace('/(tabs)/(home)');
            } catch (error) {
                console.error("Failed to handle auth success:", error);
            }
        },
        [router, setUser]
    );

    const authenticateUser = useCallback(async (user: any, userData: any = {}) => {
        try {
            await handleAuthSuccess(user, userData);
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    }, [handleAuthSuccess]);

    const loginToFirebase = useCallback(async (credentials: any) => {
        const {user} = await signInWithCredential(auth, credentials);
        await authenticateUser(user);
    }, [authenticateUser]);


    const login = useCallback(async (email: string, password: string) => {
        try {
            const {user} = await signInWithEmailAndPassword(auth, email, password);
            await authenticateUser(user);
        } catch (error) {
            console.error("Login failed:", error);
        }
    }, [authenticateUser]);

    const register = useCallback(async (username: string, email: string, password: string) => {
        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            const {user} = credentials;
            await updateProfile(user, {displayName: username});
            const userData = {displayName: username};
            await handleAuthSuccess(user, userData);
        } catch (error) {
            console.error("Registration failed:", error);
        }
    }, [handleAuthSuccess]);


    useEffect(() => {
        if (response?.type === 'success') {
            const credentials = GoogleAuthProvider.credential(response.params.id_token);
            loginToFirebase(credentials);
        }
    }, [response, loginToFirebase]);

    const pickImage = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setLoad(true);
        }
    }, []);

    useEffect(() => {
        if (image && auth.currentUser) {
            uploadAvatar(image, auth.currentUser.uid)
                .then((url) => updateUserAvatar(auth.currentUser!.uid, url, auth.currentUser))
                .catch((error) => console.error("Failed to upload avatar:", error))
                .finally(() => setLoad(false));
        }
    }, [image]);

    return {request, promptAsync, pickImage, isLoadImage, login, register};
};