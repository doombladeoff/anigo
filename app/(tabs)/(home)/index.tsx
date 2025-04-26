import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimeList } from "@/components/AnimeList";
import { HelloWave } from "@/components/HelloWave";
import { RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAnimeList } from "@/hooks/useAnimeList";
import { onScreenProps, topProps } from "@/constants/QLRequestProps";

import { Recommendations } from "@/components/Recommendations";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { YummyAPI } from "@/api/Yummy";
import Animated, { ScrollHandlerProcessed } from "react-native-reanimated";
import AnimatedRefreshLoader from "@/components/ui/RefreshLoader";

const listStyles = {
    containerStyle: {paddingHorizontal: 10, gap: 10},
    headerTextStyle: {fontSize: 22},
    headerContentStyle: {paddingHorizontal: 10},
};

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const bottomTabHeight = useBottomTabBarHeight();
    const {animeList} = useAnimeList();

    const [refreshing, setRefreshing] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const scrollHandlerRef = useRef<ScrollHandlerProcessed | null>(null);

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            const newRecommendations = await YummyAPI.getRecommendations();
            setRecommendations(newRecommendations);
        } catch (error) {
            console.error('Ошибка обновления рекомендаций:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        handleRefresh();
    }, []);


    return (
        <ThemedView style={{flex: 1, paddingTop: insets.top, gap: 20}}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLogoContainer}>
                    <ThemedText type="title">AniGO</ThemedText>
                    <HelloWave/>
                </View>
                <TouchableOpacity activeOpacity={0.8} hitSlop={10} onPress={() => {
                    router.push({pathname: '/(screens)/favorites'})
                }}>
                    <FontAwesome name={'bookmark'} size={32} color="orange" style={{paddingHorizontal: 15}}/>
                </TouchableOpacity>
            </View>

            <AnimatedRefreshLoader refreshing={refreshing} scrollHandlerRef={scrollHandlerRef}/>

            <Animated.ScrollView
                onScroll={scrollHandlerRef.current || undefined}
                scrollEventThrottle={16}
                contentContainerStyle={{gap: 10, paddingBottom: bottomTabHeight + 20}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['transparent']}
                                    tintColor='transparent'
                                    style={{backgroundColor: 'transparent'}}
                    />
                }
            >
                <Recommendations recommendations={recommendations}/>
                <AnimeList
                    headerText="Top Rated"
                    showType="Top"
                    animeList={animeList.topRated}
                    horizontal={true}
                    queryProps={topProps}
                    showLimit={5}
                    isLoading={animeList.topRated.length === 0}
                    {...listStyles}
                />
                <AnimeList
                    headerText="On Screens"
                    showType="OnScreens"
                    animeList={animeList.onScreen}
                    horizontal={true}
                    queryProps={onScreenProps}
                    showLimit={5}
                    isLoading={animeList.onScreen.length === 0}
                    {...listStyles}
                />
            </Animated.ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        gap: 10,
        paddingHorizontal: 10,
    },
    headerLogoContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
});
