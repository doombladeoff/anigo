import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Добавляет аниме в избранное пользователя.
 * @param userId - ID пользователя
 * @param anime - объект аниме (например: {id: 123, title: "Naruto"})
 */
export const addFavoriteAnime = async (
    userId: string,
    anime: { id: number; title: string, poster: string }
) => {
    try {
        const animeRef = doc(db, "user-collection", userId, "favorites", anime.id.toString());

        await setDoc(animeRef, {
            id: anime.id,
            title: anime.title,
            poster: anime.poster,
            createdAt: new Date().toISOString(),
        });

        console.log("Аниме добавлено в избранное");
    } catch (error) {
        console.error("Ошибка при добавлении избранного:", error);
    }
};

export const removeFavoriteAnime = async (userId: string, animeId: number) => {
    const animeRef = doc(db, "user-collection", userId, "favorites", animeId.toString());
    await deleteDoc(animeRef);
};

/**
 * Получает все избранные аниме пользователя.
 * @param userId - ID пользователя
 * @returns Массив объектов аниме
 */
export const getFavoriteAnime = async (userId: string) => {
    try {
        if (!userId) return;
        const favoritesRef = collection(db, "user-collection", userId, "favorites");
        const querySnapshot = await getDocs(favoritesRef);

        const favorites = querySnapshot.docs.map((doc) => doc.data());
        console.log(favorites)
        return favorites;
    } catch (error) {
        console.error("Ошибка при получении избранного:", error);
        return [];
    }
};

/**
 * Проверяет, есть ли аниме в избранном пользователя.
 * @param userId - ID пользователя
 * @param animeId - ID аниме
 * @returns true, если аниме в избранном; иначе false
 */
export const isAnimeInFavorites = async (
    userId: string,
    animeId: string | number
): Promise<boolean> => {
    try {
        const animeRef = doc(db, "user-collection", userId, "favorites", String(animeId));
        const docSnap = await getDoc(animeRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Ошибка при проверке избранного:", error);
        return false;
    }
};