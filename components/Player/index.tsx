import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KodikAPI } from "@/api/kodik";
import { SelectPicker } from "@/components/SelectPicker";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";
import { Client } from "kodikwrapper";
import { storage } from "@/utils/storage";

type Voicer = {
    id: number;
    title: string;
};


type PlayerProps = {
    malId: number;
};

export const Player = ({malId}: PlayerProps) => {
    const tokenRef = useRef<string | null>(null);
    const useNativeControls = useRef(false);

    const [selectedCaster, setSelectedCaster] = useState<Voicer | null>(null);
    const [voicers, setVoicers] = useState<Voicer[]>([]);
    const [episodes, setEpisodes] = useState<Record<string, string>>({});
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const player = useVideoPlayer(videoUrl, player => {
        player.loop = true;
    });
    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing
    });

    const fetchData = async () => {
        try {
            tokenRef.current = tokenRef.current || (await KodikAPI.getToken()) || "";
            const client = Client.fromToken(tokenRef.current);
            const voiceData = await client.search({
                shikimori_id: malId,
                episode: 1,
            })
            const translations = voiceData.results
                .map(item => item.translation)
                .filter(Boolean);

            setVoicers(translations);

            const savedVoicerId = storage.getEpisodeCaster(`${malId}`);
            const savedTranslations = translations.find(v => v.id.toString() === savedVoicerId);
            setSelectedCaster(savedTranslations || translations[0] || null);
        } catch (error) {
            console.error("Ошибка при получении озвучек:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const fetchEpisodes = async (selectedCaster: Voicer) => {
        try {
            const {id, title} = selectedCaster;
            const episodesData = await KodikAPI.getInfoById({
                token: tokenRef.current || "",
                voicerId: id,
                voicerTitle: title,
                shikiTitleId: malId,
            });

            const episodeList = episodesData?.[0]?.episodes ?? {};
            setEpisodes(episodeList);

            const storedEpisode = storage.getLastViewEpisode(`${malId}`);
            const firstEpisode = Object.keys(episodeList)[0] ?? null;
            setSelectedEpisode(storedEpisode && episodeList[storedEpisode] ? storedEpisode : firstEpisode);
        } catch (error) {
            console.error("Ошибка при получении серий:", error);
        }
    };

    useEffect(() => {
        if (!selectedCaster?.id || !tokenRef.current) return;
        fetchEpisodes(selectedCaster);
    }, [selectedCaster?.id]);

    useEffect(() => {
        if (!selectedEpisode || !episodes[selectedEpisode] || !tokenRef.current) return;

        const fetchVideoLink = async () => {
            try {
                const links = await KodikAPI.getLinksWithActualEndpoint(selectedEpisode, episodes);
                const link = links?.[0];
                setVideoUrl(link?.startsWith("https:") ? link : `https:${link}`);
            } catch (error) {
                console.error("Ошибка при получении ссылки на серию:", error);
            }
        };
        fetchVideoLink();
    }, [selectedEpisode]);

    const handleVoicersSelect = useCallback(
        (id: string) => {
            const selected = voicers.find((v) => v.id.toString() === id);
            if (selected) {
                setSelectedCaster(selected);
                setSelectedEpisode(null);
                storage.setEpisodeCaster(`${malId}`, selected.id.toString());
            }
        },
        [voicers, malId]
    );

    const handleEpisodeChange = useCallback(
        (key: string) => {
            setSelectedEpisode(key);
            storage.setLastViewEpisode(`${malId}`, key);
        },
        [malId]
    );

    const episodeOptions = useMemo(
        () => Object.keys(episodes).map((key) => ({
            label: `Серия ${key}`,
            value: key
        })),
        [episodes]
    );

    return (
    <View style={{marginTop: 10}}>
        <View style={{flexDirection: 'row'}}>
            <SelectPicker
            title="Серия"
            options={episodeOptions}
            onSelect={handleEpisodeChange}
            >
                <View style={styles.selectItemContainer}>
                    <ThemedText>Серия</ThemedText>
                    <ThemedText>{selectedEpisode || "Не выбрано"}</ThemedText>
                </View>
            </SelectPicker>

            <SelectPicker
            title="Озвучка"
            options={voicers.map((v) => ({
                label: v.title,
                value: v.id.toString()
            }))}
            onSelect={handleVoicersSelect}
            >
                <View style={styles.selectItemContainer}>
                    <ThemedText>Озвучка</ThemedText>
                    <ThemedText>{selectedCaster?.title || "Выбрать"}</ThemedText>
                </View>
            </SelectPicker>
        </View>
        <View>
            {videoUrl ? (
                <>
                    <Pressable style={[styles.playBtn, {opacity: isPlaying ? 0 : 1}]}
                               onPress={() => {
                                   useNativeControls.current = true;
                                   player.playing ? player.pause() : player.play();
                               }}>
                        <FontAwesome6 name="play" size={52} color="white"/>
                    </Pressable>
                    <View style={styles.playerPlaceholder}/>

                    <VideoView
                        style={styles.video}
                        player={player}
                        allowsFullscreen={true}
                        allowsPictureInPicture={true}
                        startsPictureInPictureAutomatically={true}
                        nativeControls={useNativeControls.current}
                    />
                </>
            ) : (
                <View style={[styles.playerPlaceholder, { justifyContent: "center" }]}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

        </View>
    </View>
    )
};


const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: 275,
    },
    selectItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
        backgroundColor: 'rgba( 0, 0, 0, 0.3 )',
    },

    playerPlaceholder: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        width: '100%',
        height: 275
    },
    playBtn: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        zIndex: 200,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.4,
        shadowRadius: 10,
    }
});