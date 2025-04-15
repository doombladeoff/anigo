import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimeList } from "@/components/AnimeList";
import { useEffect, useState } from "react";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { OrderEnum } from "@/constants/OrderEnum";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { ThemedText } from "@/components/ThemedText";
import { HelloWave } from "@/components/HelloWave";
import { ScrollView, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    const listStyles = {
        containerStyle: {paddingHorizontal: 10, gap: 10},
        headerTextStyle: {fontSize: 22},
        headerContentStyle: {paddingHorizontal: 10},
    };

    const [topRatedAnimes, setTopRatedAnimes] = useState<ShikimoriAnime[]>();
    const [onScreensAnimes, setOnScreensAnimes] = useState<ShikimoriAnime[]>();
    const [loadingStates, setLoadingStates] = useState({
        top: true,
        screens: true,
    });

    useEffect(() => {
        const topProps: RequestProps = {
            kind: ['tv'],
            status: ['ongoing', 'released'],
            limit: 5,
            duration: ['D', 'F'],
            rating: ['pg_13', 'r'],
            order: OrderEnum.ranked,
        };

        const screenProps: RequestProps = {
            kind: ['tv'],
            status: ['ongoing'],
            limit: 5,
            duration: ['D', 'F'],
            rating: ['pg_13', 'r'],
            order: OrderEnum.ranked,
        };

        const fetchAll = async () => {
            try {
                const [top, screens] = await Promise.allSettled([
                    getAnimeList(topProps),
                    getAnimeList(screenProps),
                ]);

                if (top.status === "fulfilled") {
                    setTopRatedAnimes(top.value);
                    setLoadingStates(prev => ({...prev, top: false}));
                } else {
                    console.error("Top Rated failed:", top.reason);
                }

                if (screens.status === "fulfilled") {
                    setOnScreensAnimes(screens.value);
                    setLoadingStates(prev => ({...prev, screens: false}));
                } else {
                    console.error("On Screens failed:", screens.reason);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAll();
    }, []);

    return (
    <ThemedView style={{flex: 1, paddingTop: insets.top, gap: 20}}>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10}}>
            <ThemedText type='title'>AniGO</ThemedText>
            <HelloWave/>
        </View>

        <ScrollView contentContainerStyle={{gap: 10}}>
            <AnimeList
            headerText="Top Rated"
            showType="Top"
            animeList={topRatedAnimes}
            isLoading={loadingStates.top}
            {...listStyles}
            />
            <AnimeList
            headerText="On Screens"
            showType="OnScreens"
            animeList={onScreensAnimes}
            isLoading={loadingStates.screens}
            {...listStyles}
            />
        </ScrollView>
    </ThemedView>
    );
}