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
    isFavorite: (id: number) => boolean;
    addFavorite: (anime: FavoriteItem) => Promise<void>;
    removeFavorite: (id: string) => Promise<void>;
    fetchFavorites: () => Promise<void>;
    sortFavorite: () => void;
    setFavorites: React.Dispatch<React.SetStateAction<FavoriteItem[]>>;
    sortType: "asc" | "desc" | null;
    setSortType: React.Dispatch<React.SetStateAction<"asc" | "desc" | null>>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [sortType, setSortType] = useState<"asc" | "desc" | null>(null);
    const { user } = useAuth();

    const sortFavorite = useCallback(() => {
        if (!sortType) return;
        setFavorites(prev => {
            const sorted = [...prev].sort((a, b) => {
                const aTime = new Date(a.createdAt).getTime();
                const bTime = new Date(b.createdAt).getTime();
                return sortType === "asc" ? aTime - bTime : bTime - aTime;
            });
            return sorted;
        });
    }, [sortType]);

    useEffect(() => {
        if (sortType !== null) {
            sortFavorite();
        }
    }, [sortType]);

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
        (id: number) => favorites.some((anime) => anime.id === id),
        [favorites]
    );

    const addFavorite = useCallback(
        async (anime: FavoriteItem) => {
            if (!user || isFavorite(Number(anime.id))) return;

            await addFavoriteAnime(user.uid, {
                id: Number(anime.id),
                title: anime.title,
                poster: anime.poster,
            });

            setFavorites(prev => {
                const updated = [...prev, anime];
                if (!sortType) return updated;
                return updated.sort((a, b) => {
                    const aTime = new Date(a.createdAt).getTime();
                    const bTime = new Date(b.createdAt).getTime();
                    return sortType === "asc" ? aTime - bTime : bTime - aTime;
                });
            });
        },
        [user, isFavorite, sortType]
    );

    const removeFavorite = useCallback(
        async (id: string) => {
            if (!user) return;

            await removeFavoriteAnime(user.uid, Number(id));
            setFavorites(prev => {
                const filtered = prev.filter(anime => anime.id !== Number(id));
                if (!sortType) return filtered;
                return filtered.sort((a, b) => {
                    const aTime = new Date(a.createdAt).getTime();
                    const bTime = new Date(b.createdAt).getTime();
                    return sortType === "asc" ? aTime - bTime : bTime - aTime;
                });
            });
        },
        [user, sortType]
    );

    const value = useMemo(() => ({
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        fetchFavorites,
        sortFavorite,
        setFavorites,
        sortType,
        setSortType,
    }), [
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        fetchFavorites,
        sortFavorite,
        setFavorites,
        sortType,
        setSortType,
    ]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
