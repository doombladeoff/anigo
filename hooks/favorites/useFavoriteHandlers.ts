import { useFavorites } from "@/context/FavoritesContext";
import { useAnimeFavorite } from "./useAnimeFavorite";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useCallback, useState } from "react";
import * as Haptics from 'expo-haptics';
import { useAnimeStore } from "@/store/animeStore";

interface Props {
    malId: string;
    anime: any;
    isFav: string;
    statusParam: string;
}

export const useFavoriteHandlers = ({ malId, anime, isFav, statusParam }: Props) => {
    const { setStatuss } = useAnimeStore();
    const { addFavorite, removeFavorite, updateStatus, favorites } = useFavorites();

    const { isFavorite, setIsFavorite, status, setStatus } = useAnimeFavorite(
        {
            id: malId,
            isFavoriteFromParams: isFav,
            favorites,
            statusProp: statusParam,
        }
    );

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const triggerScale = useCallback(() => {
        scale.value = withSpring(1.2, { stiffness: 200 }, () => {
            scale.value = withSpring(1);
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }, []);

    const handleBookmarkToggle = useCallback(async (newStatus = '') => {
        if (buttonDisabled || !anime) return;
        setButtonDisabled(true);
        setTimeout(() => setButtonDisabled(false), 1000);

        if (isFav || isFavorite) {
            await updateStatus(malId, newStatus);
        } else {
            await addFavorite({
                id: Number(malId),
                title: anime.russian || '',
                poster: anime.poster.main2xUrl || '',
                createdAt: new Date().toISOString(),
                status: newStatus,
            });
        }

        setStatuss(newStatus);
        setIsFavorite(true);
        setStatus(newStatus);
        triggerScale();
    }, [isFav, isFavorite, anime, buttonDisabled]);

    const handleRemoveFavorite = useCallback(async () => {
        await removeFavorite(malId);
        setIsFavorite(false);
        triggerScale();
    }, [malId]);

    return {
        isFavorite,
        buttonDisabled,
        animatedStyle,
        handleBookmarkToggle,
        handleRemoveFavorite
    };
};
