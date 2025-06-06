import { useAuth } from "@/context/AuthContext";
import { FavoriteItem } from "@/interfaces/FavoriteItem.interfaces";
import { useAnimeStore } from "@/store/animeStore";
import { isAnimeInFavorites } from "@/utils/firebase/userFavorite";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";

interface AnimeFavorite {
    id: string;
    isFavoriteFromParams: string;
    favorites: FavoriteItem[];
    statusProp: string;

}
export function useAnimeFavorite({ id, isFavoriteFromParams, favorites, statusProp }: AnimeFavorite) {
    const { user } = useAuth();
    const { status: statusParam } = useLocalSearchParams();
    const { setStatuss } = useAnimeStore();

    const [isFavorite, setIsFavorite] = useState<boolean>(isFavoriteFromParams === "true");

    const initialStatus = useMemo(() => {
        const fromFavorites = favorites.find(f => f.id === Number(id))?.status;
        const statusValue = fromFavorites || (statusProp || statusParam) || '';
        return statusValue;
    }, [favorites, id, statusProp, statusParam]);

    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        if (initialStatus) {
            setStatuss(initialStatus as string);
        }
    }, [initialStatus]);

    useEffect(() => {
        const check = async () => {
            if (!isFavoriteFromParams && user) {
                const res = await isAnimeInFavorites(user.uid, id);
                setIsFavorite(res);
            }
        };
        check();
    }, [id]);

    return { isFavorite, setIsFavorite, status, setStatus };
}
