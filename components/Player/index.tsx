import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { KodikAPI } from "@/api/kodik";
import { SelectPicker } from "@/components/SelectPicker";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";
import { Client } from "kodikwrapper";

type Voicer = {
    id: number;
    title: string;
};


type PlayerProps = {
    malId: number;
};

export const Player = ({malId}: PlayerProps) => {
    const tokenRef = useRef<string | null>(null);
    const [selectedCaster, setSelectedCaster] = useState<Voicer | null>(null);
    const [voicers, setVoicers] = useState<Voicer[]>([]);
    const [episodes, setEpisodes] = useState<Record<string, string>>({});
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
    const [videoUrl, serVideoUrl] = useState<string | null>(null);
    const useNativeControls = useRef(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!tokenRef.current) {
                    tokenRef.current = await KodikAPI.getToken();
                }

                const client = Client.fromToken(tokenRef.current || "");
                const voiceData = await client.search({
                    shikimori_id: malId,
                    episode: 1,
                })
                const allTranslations = voiceData.results.map(item => item.translation).filter(Boolean);
                console.log(allTranslations)

                if (!allTranslations) return setVoicers([]);

                setVoicers(allTranslations);
                setSelectedCaster(allTranslations[0] || null);


                // const voicersData = await KodikAPI.getVoicers({
                //     token: tokenRef.current || "",
                //     shikiTitleId: malId,
                // });

                // if (!voicersData) return setVoicers([]);
                //
                // setVoicers(voicersData);
                // setSelectedCaster(voicersData[0] || null);

            } catch (error) {
                console.error("Ошибка при получении озвучек:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedCaster?.id || !tokenRef.current) return;

        const fetchEpisodes = async () => {
            try {
                const {id, title} = selectedCaster;
                const episodesData = await KodikAPI.getInfoById({
                    token: tokenRef.current || "",
                    voicerId: id,
                    voicerTitle: title,
                    shikiTitleId: malId,
                });

                if (episodesData?.[0]?.episodes) {
                    setEpisodes(episodesData[0].episodes);
                    setSelectedEpisode(Object.keys(episodesData[0].episodes)[0]);
                }
            } catch (error) {
                console.error("Ошибка при получении серий:", error);
            }
        };
        fetchEpisodes();
    }, [selectedCaster?.id]);

    useEffect(() => {
        if (!selectedEpisode || !episodes[selectedEpisode] || !tokenRef.current) return;

        const fetchVideoLink = async () => {
            try {
                const links = await KodikAPI.getLinksWithActualEndpoint(
                selectedEpisode,
                episodes
                );
                const validLink = links?.[0]?.startsWith("https:")
                ? links[0]
                : `https:${links?.[0] || ""}`;
                serVideoUrl(validLink);
            } catch (error) {
                console.error("Ошибка при получении ссылки на серию:", error);
            }
        };
        fetchVideoLink();
    }, [selectedEpisode]);


    const player = useVideoPlayer(videoUrl, player => {
        player.loop = true;
    });
    const {isPlaying} = useEvent(player, 'playingChange', {isPlaying: player.playing});

    const handleVoicersSelect = (casterId: string) => {
        const selected = voicers.find((v) => v.id === Number(casterId));
        setSelectedCaster(selected || null);
        setSelectedEpisode(null);
    }

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
            onSelect={(episodeKey) => setSelectedEpisode(episodeKey)}
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
            onSelect={(casterId) => handleVoicersSelect(casterId)}
            >
                <View style={styles.selectItemContainer}>
                    <ThemedText>Озвучка</ThemedText>
                    <ThemedText>{selectedCaster?.title || "Выбрать"}</ThemedText>
                </View>
            </SelectPicker>
        </View>
        <View>
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