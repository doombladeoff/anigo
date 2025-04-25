import { ref, uploadBytes, getDownloadURL, deleteObject } from "@firebase/storage";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, FIREBASE_STORAGE } from "@/lib/firebase";

export const uploadAvatar = async (uri: string, userId: string) => {
    const userDocRef = doc(db, 'user-collection', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const oldAvatarURL = userData.avatarURL;

        if (oldAvatarURL) {
            const oldAvatarPath = decodeURIComponent(oldAvatarURL.split('/o/')[1].split('?')[0]);
            const oldAvatarRef = ref(FIREBASE_STORAGE, oldAvatarPath);

            try {
                await deleteObject(oldAvatarRef);
            } catch (error) {
                console.warn("Не удалось удалить предыдущую аватарку:", error);
            }
        }
    }

    const filename = uri.split('/').pop();
    const avatarRef = ref(FIREBASE_STORAGE, `avatars/${userId}/${filename}`);
    const response = await fetch(uri);
    const blob = await response.blob();
    await uploadBytes(avatarRef, blob);
    return getDownloadURL(avatarRef);
};

export const updateUserAvatar = async (userId: string, avatarUrl: string, user: any) => {
    const userRef = doc(db, 'user-collection', userId);
    await setDoc(userRef, { avatarURL: avatarUrl, lastLoginAt: serverTimestamp() }, { merge: true });
    if (user) {
        await updateProfile(user, { photoURL: avatarUrl });
    }
};