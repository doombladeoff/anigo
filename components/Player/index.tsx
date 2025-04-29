import { usePlayerAPI } from "@/hooks/player/usePlayerAPI";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent, useEventListener } from "expo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import { SelectPicker } from "@/components/SelectPicker";
import { Loader } from "@/components/ui/Loader";
import { ThemedText } from "@/components/ThemedText";
import { storage } from "@/utils/storage";
import { FontAwesome6 } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

type PlayerProps = {
    malId: number;
    worldArt_id?: number;
    kinopoisk_id?: number;
    onLayout?: (e: LayoutChangeEvent) => void;
};

export const Player = ({malId, worldArt_id, onLayout, kinopoisk_id}: PlayerProps) => {
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
    } = usePlayerAPI(malId, worldArt_id, kinopoisk_id);

    const isDark = useThemeColor({light: 'black', dark: 'white'}, 'background')

    const playerRef = useRef<VideoView>(null);
    const hasSkippedRef = useRef(false);

    const player = useVideoPlayer(videoUrl, player => {
        player.timeUpdateEventInterval = 1;
        player.currentTime = 0;
    });

    const [useNativeControls, setUseNativeControls] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(true);

    const skipOpening = storage.getSkipOpening();

    const {isPlaying} = useEvent(player, "playingChange", {isPlaying: player.playing});
    const {status} = useEvent(player, "statusChange", {status: player.status});

    const videoLoaded = useMemo(() => status === "readyToPlay", [status]);


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCaster) fetchEpisodes(selectedCaster);
    }, [selectedCaster]);

    useEffect(() => {
        if (selectedEpisode) fetchVideoUrl(selectedEpisode);
    }, [selectedEpisode]);

    useEventListener(player, "timeUpdate", ({currentTime}) => {
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

    const handleEpisodeChange = useCallback((key: string) => {
        setSelectedEpisode(key);
        setShowPlayButton(true);
        setUseNativeControls(false);
        hasSkippedRef.current = false;
        storage.setLastViewEpisode(`${malId}`, key);
    }, [malId]);

    const episodeOptions = useMemo(() => (
        Object.keys(episodes).map(key => ({
            label: `Серия ${key}`,
            value: key,
        }))
    ), [episodes]);

    const voicerOptions = useMemo(() => (
        voicers.map(v => ({
            label: v.title,
            value: v.id.toString(),
        }))
    ), [voicers]);

    const handlePlayPress = () => {
        setUseNativeControls(true);
        setShowPlayButton(false);
        player.play();
    };

    return (
        <>
            <View style={styles.container} onLayout={onLayout}>
                <View style={styles.playerHeader}>
                    <SelectPicker title="Серия" options={episodeOptions} onSelect={handleEpisodeChange}>
                        <View style={[styles.selectItem, {shadowColor: isDark}]}>
                            <ThemedText lightColor={'white'}>Серия</ThemedText>
                            <ThemedText lightColor={'white'}>{selectedEpisode || "Не выбрано"}</ThemedText>
                        </View>
                    </SelectPicker>

                    <SelectPicker title="Озвучка" options={voicerOptions} onSelect={handleVoicerSelect}>
                        <View style={[styles.selectItem, {shadowColor: isDark}]}>
                            <ThemedText lightColor={'white'}>Озвучка</ThemedText>
                            <ThemedText lightColor={'white'}>{selectedCaster?.title || "Выбрать"}</ThemedText>
                        </View>
                    </SelectPicker>
                </View>

                <View>
                    {videoUrl ? (
                        <VideoView
                            style={styles.video}
                            player={player}
                            allowsFullscreen
                            allowsPictureInPicture
                            contentFit="fill"
                            startsPictureInPictureAutomatically
                            nativeControls={useNativeControls}
                            ref={playerRef}
                            importantForAccessibility="no"
                        />
                    ) : (
                        <View style={styles.loaderContainer}>
                            <Loader size={42} color={'white'}/>
                        </View>
                    )}

                    {!videoLoaded && (
                        <View style={styles.overlay}>
                            <Loader size={44} color={'white'}/>
                        </View>
                    )}

                    {videoLoaded && showPlayButton && (
                        <View style={styles.overlay}>
                            <Pressable onPress={handlePlayPress} style={styles.iconShadow}>
                                <FontAwesome6 name="play" size={44} color="white"/>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    video: {
        width: "100%",
        height: 275,
    },
    playerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
    },
    selectItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
        backgroundColor: 'rgba(0,0,0,1)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.45,
        shadowRadius: 7,
        borderRadius: 15,
    },
    loaderContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        height: 275,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    iconShadow: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.65,
        shadowRadius: 10,
    }
});
