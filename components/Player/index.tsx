import { usePlayerAPI } from "@/hooks/player/usePlayerAPI";
import { useVideoPlayer } from "expo-video";
import { useEvent, useEventListener } from "expo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { storage } from "@/utils/storage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LastWatchAnime } from "@/utils/firebase/LastWatchAnime";
import { useAuth } from "@/context/AuthContext";
import { User } from "firebase/auth";
import { NextEpisodePlaceholder } from "./NextEpisodePlaceholder";
import { VideoPlayer } from "./VideoPlayer";
import { EpisodeVoiceSelector } from "./EpisodeVoiceSelector";

type PlayerProps = {
    malId: number;
    worldArt_id?: number;
    kinopoisk_id?: number;
    onLayout?: (e: LayoutChangeEvent) => void;
    poster: string;
    nextEpisode?: string | null;
    currentAvailable?: number | null;
    episodes?: number | null;

};

export const Player = ({ malId, worldArt_id, onLayout, kinopoisk_id, poster, nextEpisode, currentAvailable, episodes: allEpisodes }: PlayerProps) => {
    const {
        voicers,
        episodes,
        videoUrl,
        skipTime,
        fetchData,
        fetchEpisodes,
        fetchVideoUrl,
        setSelectedEpisode,
        selectedEpisode,
        setSelectedCaster,
        selectedCaster,
        isEmpty,
    } = usePlayerAPI(malId, worldArt_id, kinopoisk_id);

    const { user } = useAuth();
    const isDark = useThemeColor({ light: 'black', dark: 'white' }, 'background');

    const [isNextEpisode, setIsNextEpisode] = useState(false);
    const selectedKey = useRef<number | null>(null);
    const hasSkippedRef = useRef(false);
    const skipOpening = storage.getSkipOpening();

    const [useNativeControls, setUseNativeControls] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(true);

    const player = useVideoPlayer(videoUrl, player => {
        player.timeUpdateEventInterval = 1;
        player.currentTime = 0;
    });

    const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });
    const { status } = useEvent(player, "statusChange", { status: player.status });

    const videoLoaded = useMemo(() => status === "readyToPlay", [status]);

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (selectedCaster) fetchEpisodes(selectedCaster);
    }, [selectedCaster]);

    useEffect(() => {
        if (!selectedKey.current)
            selectedKey.current = Number(selectedEpisode);
    }, [selectedEpisode]);


    useEffect(() => {
        if (!selectedKey.current) return;

        const key = selectedKey.current.toString();
        const episodeExists = Object.prototype.hasOwnProperty.call(episodes, key);

        setIsNextEpisode(!episodeExists);

        if (episodeExists && selectedEpisode) {
            fetchVideoUrl(selectedEpisode);
        }
    }, [selectedEpisode, episodes]);

    useEventListener(player, "timeUpdate", ({ currentTime }) => {
        if (hasSkippedRef.current || !skipOpening || !skipTime) return;

        if (currentTime >= skipTime.start && currentTime <= skipTime.end) {
            player.currentTime = skipTime.end;
            hasSkippedRef.current = true;
        }
    });

    const handleVoicerSelect = useCallback((id: string) => {
        const selected = voicers.find(v => v.id.toString() === id);
        if (!selected) return;

        setSelectedCaster(selected);
        setSelectedEpisode(null);
        setShowPlayButton(true);
        setUseNativeControls(false);
        hasSkippedRef.current = false;
        storage.setEpisodeCaster(`${malId}`, selected.id.toString());
    }, [voicers, malId]);

    const handleEpisodeChange = useCallback((key: string, id: number) => {
        setSelectedEpisode(key);
        setShowPlayButton(true);
        setUseNativeControls(false);
        hasSkippedRef.current = false;
        selectedKey.current = id;
        storage.setLastViewEpisode(`${malId}`, key);
    }, [malId]);

    const episodeOptions = useMemo(() => {
        const keys = Object.keys(episodes);
        const options = keys.map(key => ({
            label: `Серия ${key}`,
            value: key,
        }));

        if (keys.length === allEpisodes) return options;
        if (currentAvailable !== allEpisodes) {
            const nextId = keys.length + 1;
            options.push({ label: `Серия ${nextId}`, value: `${nextId}` });
        };

        return options;
    }, [episodes, currentAvailable, allEpisodes]);

    const voicerOptions = useMemo(() => (
        voicers.map(v => ({
            label: v.title,
            value: v.id.toString(),
        }))
    ), [voicers]);

    const handlePlayPress = async () => {
        setUseNativeControls(true);
        setShowPlayButton(false);
        player.play();
        if (user && selectedEpisode) {
            await LastWatchAnime({ user: user as User, id: malId, episode: selectedEpisode, poster });
        }
    };

    if (isEmpty) return null;

    return (
        <View style={{ marginTop: 10 }} onLayout={onLayout}>
            <EpisodeVoiceSelector
                selectedEpisode={selectedEpisode}
                selectedCaster={selectedCaster}
                episodeOptions={episodeOptions}
                voicerOptions={voicerOptions}
                onEpisodeSelect={handleEpisodeChange}
                onVoicerSelect={handleVoicerSelect}
                isDark={isDark}
            />
            <View>
                {isNextEpisode ? (
                    <NextEpisodePlaceholder nextEpisode={nextEpisode || null} episodesCount={Object.keys(episodes).length} />
                ) :
                    <VideoPlayer
                        player={player}
                        videoUrl={videoUrl}
                        videoLoaded={videoLoaded}
                        showPlayButton={showPlayButton}
                        onPlayPress={handlePlayPress}
                        nativeControls={useNativeControls}
                    />}
            </View>
        </View>
    );
};