import { useCallback, useRef, useState } from "react";
import { KodikAPI } from "@/api/kodik";
import { Client, SearchParams } from "kodikwrapper";
import { parseSkipTime } from "@/utils/playerHelpers";
import { storage } from "@/utils/storage";

type Voicer = {
    id: number;
    title: string;
};

export const usePlayerAPI = (malId: number, worldArt_id?: number, kinopoisk_id?: number) => {
    const tokenRef = useRef<string | null>(null);
    const [voicers, setVoicers] = useState<Voicer[]>([]);
    const [episodes, setEpisodes] = useState({});
    const [selectedCaster, setSelectedCaster] = useState<Voicer | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [skipTime, setSkipTime] = useState<{ start: number; end: number } | null>(null);

    const fetchData = useCallback(async () => {
        tokenRef.current = tokenRef.current || (await KodikAPI.getToken());
        const client = Client.fromToken(tokenRef.current!);

        const params: SearchParams = {
            shikimori_id: malId,
            worldart_animation_id: worldArt_id,
            kinopoisk_id: kinopoisk_id,
            episode: 0,
        };
        const cleanedParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value != null)
        );
        const voiceData = await client.search(cleanedParams);
        const translations = voiceData.results.map(item => item.translation).filter(Boolean);
        setVoicers(translations);
        const savedVoicerId = storage.getEpisodeCaster(`${malId}`);
        const savedTranslations = translations.find(v => v.id.toString() === savedVoicerId);
        setSelectedCaster(savedTranslations || translations[0] || null);
    }, [malId, worldArt_id, kinopoisk_id]);

    const fetchEpisodes = useCallback(async (caster: any) => {
        const {id, title} = caster;
        const episodesData = await KodikAPI.getInfoById({
            token: tokenRef.current!,
            voicerId: id,
            voicerTitle: title,
            shikiTitleId: malId,
            worldId: worldArt_id
        });
        const epList = typeof episodesData?.[0]?.episodes === "object"
            ? episodesData[0].episodes
            : {1: episodesData?.[0]?.episodes || {}};
        setEpisodes(epList);
        const storedEpisode = storage.getLastViewEpisode(`${malId}`);
        const firstEpisode = Object.keys(epList)[0] ?? null;
        setSelectedEpisode(storedEpisode && epList[storedEpisode] ? storedEpisode : firstEpisode);
    }, [malId]);

    const fetchVideoUrl = useCallback(async (episode: string) => {
        const links = await KodikAPI.getLinksWithActualEndpoint(episode, episodes);
        const link = links?.[0];
        if (!link) return;
        setVideoUrl(link.url?.startsWith("https:") ? link.url : `https:${link.url}`);
        if (link.skipTime) {
            setSkipTime(parseSkipTime(link.skipTime));
        }
    }, [episodes]);

    return {
        voicers,
        episodes,
        videoUrl,
        skipTime,
        fetchData,
        fetchEpisodes,
        fetchVideoUrl,
        selectedCaster,
        setSelectedCaster,
        selectedEpisode,
        setSelectedEpisode,
    };
};