import { useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import axios from "axios";

import { ThemedText } from "@/components/ThemedText";
import { Loader } from "@/components/ui/Loader";
import { getCharacter } from "@/api/shikimori/getCharacter";
import { Character } from "@/interfaces/Shikimori.interfaces";
import { Character as CharacterJikan, VoiceActor } from "@/interfaces/Jikan.interfaces";
import { cleanedText } from "@/utils/cleanTextTags";

export default function CharacterScreen() {
    const { id } = useLocalSearchParams();
    const headerHeight = useHeaderHeight();

    const [character, setCharacter] = useState<Character | null>(null);
    const [characterJikan, setCharacterJikan] = useState<CharacterJikan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCharacterData = async () => {
        try {
            const [shikiData, jikanData] = await Promise.all([
                getCharacter(id?.toString() || ""),
                axios.get(`https://api.jikan.moe/v4/characters/${id}/full`)
            ]);

            setCharacter(shikiData[0] || null);
            setCharacterJikan(jikanData.data.data || null);
        } catch (error) {
            console.error("Failed to fetch character data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacterData();
    }, [id]);

    const showDescription = useMemo(
        () => character?.description && character.description.trim().length > 0,
        [character]
    );

    if (isLoading) {
        return (
            <Loader
                size={34}
                containerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            />
        );
    }

    if (!character) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ThemedText>Персонаж не найден</ThemedText>
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                paddingTop: headerHeight + 20,
                paddingHorizontal: 20,
                paddingBottom: headerHeight / 2
            }}
        >
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={{ uri: character.poster.mainUrl }}
                    style={{ width: 180, height: 280, borderRadius: 8 }}
                    transition={300}
                />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <ThemedText type="title" style={{ fontSize: 18 }}>
                        Имя: {character.russian}
                    </ThemedText>
                    <ThemedText type="title" style={{ fontSize: 16 }}>
                        Japanese: {character.japanese}
                    </ThemedText>
                    {characterJikan?.anime?.[0]?.role && (
                        <ThemedText type="title" style={{ fontSize: 16 }}>
                            Роль: {characterJikan.anime[0].role}
                        </ThemedText>
                    )}
                </View>
            </View>

            <ThemedText type="defaultSemiBold" style={{ fontSize: 18, marginTop: 20 }}>
                Описание:
            </ThemedText>
            {showDescription ? (
                <ThemedText style={{ fontSize: 16 }}>{cleanedText(character.description)}</ThemedText>
            ) : (
                <ThemedText>Нет описания</ThemedText>
            )}

            {(characterJikan && characterJikan?.voices?.length > 0) && (
                <>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 18, marginTop: 20 }}>
                        Озвучка:
                    </ThemedText>
                    {characterJikan?.voices.map((voice: VoiceActor, index: number) => (
                        <View key={index} style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
                            <Image
                                source={{ uri: voice.person.images.jpg.image_url }}
                                style={{ width: 80, height: 80, borderRadius: 40 }}
                                transition={300}
                            />
                            <View style={{ justifyContent: "center" }}>
                                <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
                                    {voice.language}
                                </ThemedText>
                                <ThemedText style={{ fontSize: 16 }}>{voice.person.name}</ThemedText>
                            </View>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
}
