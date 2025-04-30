import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { FavoriteItem } from "@/utils/storage";
import {
    addFavoriteAnime,
    getFavoriteAnime,
    removeFavoriteAnime,
} from "@/utils/firebase/userFavorite";
import { useAuth } from "@/context/AuthContext";

type FavoritesContextType = {
    favorites: FavoriteItem[];
    isFavorite: (id: string) => boolean;
    addFavorite: (anime: FavoriteItem) => Promise<void>;
    removeFavorite: (id: string) => Promise<void>;
    fetchFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const {user} = useAuth();

    const fetchFavorites = useCallback(async () => {
        if (!user) return;
        const favs = await getFavoriteAnime(user.uid);
        setFavorites(favs as FavoriteItem[]);
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [user, fetchFavorites]);

    const isFavorite = useCallback(
        (id: string) => favorites.some((anime) => anime.id === id),
        [favorites]
    );

    const addFavorite = useCallback(
        async (anime: FavoriteItem) => {
            if (!user || isFavorite(anime.id.toString())) return;

            await addFavoriteAnime(user.uid, {
                id: Number(anime.id),
                title: anime.title,
                poster: anime.poster,
            });

            setFavorites((prev) => [...prev, anime]);
        },
        [user, isFavorite]
    );

    const removeFavorite = useCallback(
        async (id: string) => {
            if (!user) return;

            await removeFavoriteAnime(user.uid, Number(id));
            fetchFavorites();
        },
        [user]
    );

    const value = useMemo(() => ({
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        fetchFavorites,
    }), [favorites, isFavorite, addFavorite, removeFavorite, fetchFavorites]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
