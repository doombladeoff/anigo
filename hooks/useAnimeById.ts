import { useState, useEffect, useCallback } from "react";
import { useAnimeStore } from "@/store/animeStore";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { getAnimeByMalId } from "@/api/Anilist/getAnimeById";
import { AnimeFields } from "@/api/shikimori/AnimeFields.type";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { AniListAnime } from "@/interfaces/AniList.interfaces";
import { extractKinopiskID, extractWorldArtID } from "@/utils/anime/extractExternalIds";
import { getCrunchyrollIData } from "@/utils/crunchyroll/getCrunchyrollData";

const fetchFields: AnimeFields = {
    id: true,
    malId: true,
    externalLinks: { url: true },
    name: true,
    poster: { mainUrl: true, originalUrl: true, main2xUrl: true },
    russian: true,
    japanese: true,
    description: true,
    genres: { id: true, russian: true },
    characterRoles: {
        character: {
            id: true,
            name: true,
            russian: true,
            poster: { mainUrl: true }
        }
    },
    screenshots: { originalUrl: true },
    status: true,
    episodes: true,
    score: true,
    synonyms: true,
    duration: true,
    nextEpisodeAt: true,
    episodesAired: true,
    fandubbers: true,
    related: {
        id: true,
        anime: { id: true, name: true },
        relationText: true,
    },
    airedOn: { year: true, day: true, month: true },
    releasedOn: { year: true, day: true, month: true }
}

export const useAnimeById = (id: string) => {
    const { setAnime, setKinopoiskID, setWorldArtID } = useAnimeStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchAnimeData = useCallback(async () => {
        setLoading(true);
        try {
            const [animeData, animeListData]: [ShikimoriAnime, AniListAnime] = await Promise.all([
                getAnimeList({ ids: id }, fetchFields).then(res => res[0]),
                getAnimeByMalId(Number(id)),
            ]);

            const crunchData = await getCrunchyrollIData(animeListData, animeData.malId);

            setAnime({
                ...animeData,
                crunchyroll: crunchData,
                posterAniList: {
                    large: animeListData.coverImage.extraLarge,
                    extraLarge: animeListData.coverImage.extraLarge
                },
            });

            const worldArtId = extractWorldArtID(animeData.externalLinks);
            if (worldArtId) setWorldArtID(worldArtId);

            const kinopoiskId = extractKinopiskID(animeData.externalLinks);
            if (kinopoiskId) setKinopoiskID(kinopoiskId);

        } catch (error: any) {
            console.error("Ошибка загрузки аниме:", error);
            setError("Упс!\nЧто-то пошло не так. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    }, [id, setAnime, setWorldArtID, setKinopoiskID]);

    useEffect(() => {
        fetchAnimeData();
    }, [id]);

    const handleFetch = async () => {
        setError('')
        fetchAnimeData();
    };

    return {
        error,
        loading,
        handleFetch
    };
};
