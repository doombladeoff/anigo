import { db } from "@/lib/firebase";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";

const TOKEN_DOC_REF = doc(db, 'yummy-tokens', 'tokenData');

const saveTokenToFirebase = async (token: string) => {
    await setDoc(TOKEN_DOC_REF, {
        token,
        date: Date.now(),
        update: new Date()
    }, { merge: true });
};

const YUMMY_LOGIN_PAYLOAD = {
    need_json: true,
    password: process.env.EXPO_PUBLIC_YUMMY_PASS!,
    login: process.env.EXPO_PUBLIC_YUMMY_LOGIN!
};

export const loginToYummy = async () => {
    try {
        const { data } = await axios.post('https://api.yani.tv/profile/login', YUMMY_LOGIN_PAYLOAD);
        const token = data?.response?.token;
        if (!token) throw new Error('Ошибка получения токена');
        await saveTokenToFirebase(token);
    } catch (error: any) {
        console.error("loginToYummy:", error.message);
    }
};

export const refreshToken = async (token: string) => {
    try {
        const { data } = await axios.get('https://api.yani.tv/profile/token', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const newToken = data?.response?.token;
        if (!newToken) throw new Error('Ошибка обновления токена');
        await saveTokenToFirebase(newToken);
    } catch (error: any) {
        console.error("refreshToken:", error.message);
    }
};
