import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, TouchableOpacity, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useTheme } from "@react-navigation/core";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

import { getAnimeList } from "@/api/shikimori/getAnimes";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { GenresList } from "@/components/AnimeScreen/Genres";
import { ScreenshotsList } from "@/components/AnimeScreen/Screenshots";
import { Player } from "@/components/Player";
import { Description } from "@/components/AnimeScreen/Description";
import { useThemeColor } from "@/hooks/useThemeColor";

import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";

;
import { ShareButton } from "@/components/ui/ShareButton";
import { Loader } from "@/components/ui/Loader";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import { isAnimeInFavorites, } from "@/utils/firebase/userFavorite";
import * as Haptics from "expo-haptics";
import { useFavorites } from "@/context/FavoritesContext";

const GRADIENT_COLORS = {
    dark: ["transparent", "rgba(21,23,24,0.85)", "rgba(21,23,24,0.95)", "rgba(21,23,24,1)"],
    light: ["transparent", "rgba(255,255,255,0)", "rgba(255,255,255,0.7)", "rgba(255,255,255,1)"]
};

export default function AnimeScreen() {
    const {id: malId, isFavorite} = useLocalSearchParams();
    const navigation = useNavigation();

    const {user} = useAuth();
    const {addFavorite, removeFavorite} = useFavorites();

    const {dark: isDark} = useTheme();
    const iconColor = useThemeColor({light: "black", dark: "white"}, "icon");

    const [anime, setAnime] = useState<ShikimoriAnime | null>(null);
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [isFav, setIsFav] = useState(isFavorite === 'true');
    const [worldArtID, setWorldArtID] = useState<string | null>(null);
    const [kinopoiskID, setKinopoiskID] = useState<string | null>(null);

    const scrollRef = useRef<ScrollView>(null);
    const targetY = useRef(0);
    const headerHeight = useHeaderHeight();

    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
    }));

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const [animeData] = await getAnimeList({ids: malId.toString()});
                setAnime(animeData);

                const worldArtLink = animeData.externalLinks?.find((link: any) => link.url.startsWith('http://www.world-art.ru/'));
                if (worldArtLink?.url) setWorldArtID(worldArtLink ? new URL(worldArtLink.url).searchParams.get("id") : null);

                const kinopoidkLink = animeData.externalLinks?.find((link: any) => link.url.startsWith("https://www.kinopoisk.ru"));
                if (kinopoidkLink?.url) setKinopoiskID(kinopoidkLink.url.match(/\/(?:series|film)\/(\d+)/)?.[1] || null);

                if (!isFavorite && user) {
                    const res = await isAnimeInFavorites(user.uid, malId.toString());
                    setIsFav(res);
                }

                setLoading(false);
            } catch (e) {
                console.error(e)
            }

        };
        fetchAnime();
    }, [malId]);

    useEffect(() => {
        if (anime?.name) {
            navigation.setOptions({title: anime.name});
        }
    }, [anime]);

    const handleBookmarkToggle = async () => {
        if (buttonDisabled) return;
        const poster = anime?.poster.originalUrl || "";
        const title = anime?.russian || "";

        isFav ? removeFavorite(malId.toString()) : addFavorite({id: Number(malId), title, poster})

        setIsFav(!isFav);

        setButtonDisabled(true);
        setTimeout(() => setButtonDisabled(false), 1000);
        scale.value = withSpring(1.2, {stiffness: 200}, () => {
            scale.value = withSpring(1);
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    };

    const handleWatchPress = () => {
        scrollRef.current?.scrollTo({y: targetY.current, animated: true});
    };

    if (loading || !anime) {
        return (
            <ThemedView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Loader size={46}/>
            </ThemedView>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () => {
                        return <ShareButton text={anime?.russian} id={anime?.malId} iconColor={iconColor}/>
                    }
                }}
            />
            <ThemedView style={{flex: 1}}>
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{paddingTop: headerHeight, paddingBottom: headerHeight / 2}}
                >
                    <Image
                        source={{uri: anime.poster.mainUrl}}
                        style={{width: "100%", height: 520, position: "absolute"}}
                        blurRadius={3}
                        cachePolicy="disk"
                        priority="normal"
                    />

                    <LinearGradient
                        colors={GRADIENT_COLORS[isDark ? "dark" : "light"] as [string, string, ...string[]]}
                        style={{position: "absolute", width: "100%", height: 520}}
                    />

                    <View
                        style={{
                            alignSelf: "center",
                            borderRadius: 12,
                            marginTop: 20,
                            shadowColor: isDark ? 'white' : 'black',
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: isDark ? 0.35 : 0.55,
                            shadowRadius: 15,
                        }}
                    >
                        <Image
                            source={{uri: anime.poster.originalUrl}}
                            style={{width: 200, height: 300, alignSelf: "center", borderRadius: 12, marginTop: 20}}
                            cachePolicy="disk"
                            priority="high"
                        />
                    </View>

                    <ThemedText
                        type="title"
                        style={{fontSize: 18, alignSelf: "center", marginTop: 15}}
                        numberOfLines={2}
                    >
                        {anime.japanese}
                    </ThemedText>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 20,
                            width: "100%",
                            paddingHorizontal: 45,
                            paddingVertical: 15
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: isDark ? "white" : "black",
                                padding: 12,
                                paddingHorizontal: 22,
                                borderRadius: 22,
                                flex: 1,
                                alignItems: "center"
                            }}
                            onPress={handleWatchPress}
                        >
                            <ThemedText
                                darkColor="black"
                                lightColor="white"
                                style={{fontSize: 16, fontWeight: "bold"}}
                            >
                                Смотреть
                            </ThemedText>
                        </TouchableOpacity>

                        {user &&
                            <TouchableOpacity onPress={handleBookmarkToggle} hitSlop={12} disabled={buttonDisabled}>
                                <Animated.View style={animatedStyle}>
                                    <FontAwesome
                                        name={isFav ? "bookmark" : "bookmark-o"}
                                        size={32}
                                        color="#e7b932"
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        }
                    </View>

                    <GenresList
                        genres={anime.genres || []}
                        containerStyle={{gap: 10, paddingHorizontal: 10, paddingBottom: 10}}
                        genreStyle={{backgroundColor: "rgba(255, 255, 255, 0.1)", padding: 5, borderRadius: 12}}
                        genreTextStyle={{padding: 5}}
                        headerTextStyle={{paddingHorizontal: 10}}
                        headerShow={false}
                    />

                    {anime.description && <Description text={anime.description}/>}

                    <ScreenshotsList
                        images={anime.screenshots || []}
                        horizontal
                        imageStyle={{width: 280, height: 180, borderRadius: 12}}
                        containerStyle={{paddingHorizontal: 10, gap: 10, paddingTop: 10}}
                    />

                    <Player
                        malId={Number(anime.malId)}
                        worldArt_id={worldArtID ? Number(worldArtID) : undefined}
                        kinopoisk_id={kinopoiskID ? Number(kinopoiskID) : undefined}
                        poster={anime.poster.originalUrl}
                        onLayout={(e: LayoutChangeEvent) => targetY.current = e.nativeEvent.layout.y}
                    />
                </ScrollView>
            </ThemedView>
        </>
    );
}