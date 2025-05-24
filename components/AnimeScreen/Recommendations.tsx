import { useEffect, useState } from "react";
import { ThemedText } from "../ThemedText";
import { FlatList, useColorScheme, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Image } from "expo-image";
import { IconSymbol } from "../ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { YummyAPI } from "@/api/Yummy";

interface yammiItem {
    anime_id: number;
    title: string;
    remote_ids: {
        shikimori_id: number;
    };
    poster: {
        medium: string;
    };
    year: number;
    rating: {
        shikimori_rating: number;
    };
}

export const Recommendations = ({ id }: { id: number }) => {
    const [recs, setRecs] = useState<yammiItem[]>([]);
    const { user } = useAuth();
    const isDark = useColorScheme() === 'dark';

    const fetch = async () => {
        try {
            const data = await YummyAPI.getRecommendationsForAnime(Number(id), user?.yummyToken || '');
            setRecs(data);
        } catch (error: any) {
            alert(`Ошибка при получении рекомендаций: ${error.message}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            {recs.length > 0 && <ThemedText type='title' style={{ fontSize: 18, paddingHorizontal: 10, paddingTop: 10 }}>Похожие тайтлы</ThemedText>}
            <FlatList
                data={recs}
                renderItem={({ item }) =>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            router.replace({
                                pathname: '/(screens)/[id]',
                                params: { id: item.remote_ids.shikimori_id }
                            })
                        }} style={{ width: 200 / 1.55, marginRight: 15, marginVertical: 10 }}>
                        <View style={{
                            shadowColor: isDark ? 'white' : 'black',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: isDark ? 0.25 : 0.85,
                            shadowRadius: 5,
                            paddingBottom: 10
                        }}>
                            <Image
                                key={item.anime_id.toString()}
                                source={{ uri: `https:${item?.poster?.medium}` }}
                                transition={600}
                                style={{
                                    width: 200 / 1.55,
                                    height: 300 / 1.55,
                                    borderRadius: 6,
                                    backgroundColor: 'gray',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                cachePolicy="disk"
                                priority="high"
                            >
                                <IconSymbol name="photo" size={32} color="white" />
                            </Image>
                        </View>
                        <ThemedText numberOfLines={2} type='title' style={{ fontSize: 14, lineHeight: 20 }}>{item.title}</ThemedText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <ThemedText>{item.year}</ThemedText>
                            <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>·</ThemedText>
                            <ThemedText style={{ fontSize: 16, lineHeight: 20, textAlignVertical: 'center' }}>{item.rating.shikimori_rating.toFixed()}</ThemedText>
                            <IconSymbol name='star.fill' size={16} color={'green'} />
                        </View>

                    </TouchableOpacity>}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </>
    )
}