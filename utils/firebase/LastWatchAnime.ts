import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LastWatchProps {
    user: User
    id: number
    episode: number | string;
    poster: string
}

export const LastWatchAnime = async ({user, id, episode, poster}: LastWatchProps) => {
    const userRef = doc(db, 'user-collection', user.uid);

    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            await updateDoc(userRef, {
                lastAnime: id,
                lastEpisode: episode,
                lastAnimePoster: poster
            });
        } else {
            await setDoc(userRef, {
                lastAnime: id,
                lastEpisode: episode,
                lastAnimePoster: poster
            }, {merge: true});
        }

    } catch (error) {
        console.error("Ошибка при выполнении транзакции избранного:", error);
    }

}