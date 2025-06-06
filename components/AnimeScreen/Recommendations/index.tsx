import { useEffect, useState } from "react";
import { ThemedText } from "../../ThemedText";
import { FlatList, useColorScheme } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { YummyAPI } from "@/api/Yummy";
import { Yammi } from "@/interfaces/Yammi.interfaces";
import { RecommendationsCard } from "./RecommendationsCard";

export const Recommendations = ({ id }: { id: number }) => {
    const { user } = useAuth();
    const isDark = useColorScheme() === 'dark';
    const [recs, setRecs] = useState<Yammi[]>([]);
    const [isError, setIsError] = useState(false);

    const fetch = async () => {
        try {
            const data = await YummyAPI.getRecommendationsForAnime(Number(id), user?.yummyToken || '');
            setRecs(data);
        } catch (error: any) {
            setIsError(true);
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
                renderItem={({ item }) => <RecommendationsCard item={item} isDark={isDark} />}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `${item.anime_id}`}
            />
        </>
    )
}