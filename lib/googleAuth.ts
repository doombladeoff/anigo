import { useEffect, useCallback } from 'react';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { auth, db } from './firebase';
import {
    signInWithCredential,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    AuthCredential,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { storage } from "@/utils/storage";

const COLLECTION = 'user-collection';

export const useGoogleAuth = () => {
    const {setUser} = useAuth();
    const router = useRouter();

    const [request, response, promptAsync] = useAuthRequest({
        selectAccount: true,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        redirectUri: makeRedirectUri({scheme: 'com.f0rever.anigo'}),
    });

    const saveUserToFirestore = useCallback(async (user: any) => {
        const userRef = doc(db, COLLECTION, user.uid);
        await setDoc(
            userRef,
            {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastLoginAt: serverTimestamp(),
            },
            {merge: true}
        );
    }, []);

    const handleAuthSuccess = useCallback(
        async (user: any) => {
            await saveUserToFirestore(user);
            setUser(user);
            router.replace('/(tabs)/(home)');
        },
        [router, saveUserToFirestore, setUser]
    );

    const loginToFirebase = useCallback(
        async (credentials: AuthCredential) => {
            try {
                const {user} = await signInWithCredential(auth, credentials);
                const token = await user.getIdToken();
                if (!token) return;
                await handleAuthSuccess(user);
            } catch (err) {
                console.error('Google login error:', err);
            }
        },
        [handleAuthSuccess]
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const credentials = GoogleAuthProvider.credential(response.params.id_token);
            loginToFirebase(credentials);
        }
    }, [response, loginToFirebase]);

    const login = async (email: string, password: string) => {
        try {
            const {user} = await signInWithEmailAndPassword(auth, email, password);
            await handleAuthSuccess(user);
        } catch (error: any) {
            const messages: Record<string, string> = {
                'auth/invalid-credential': 'Invalid Credential',
                'auth/invalid-email': 'Invalid Email',
                'auth/missing-password': 'Invalid Password',
            };
            alert(messages[error.code] || 'Login failed');
            console.error('Login error:', error);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const {user} = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, {displayName: username});
            storage.setFirstLaunch(true);
            await handleAuthSuccess({...user, displayName: username});
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Email already in use');
            } else {
                alert('Registration failed: ' + error.message);
            }
            console.error('Register error:', error);
        }
    };

    return {
        request,
        promptAsync,
        login,
        register,
    };
};
