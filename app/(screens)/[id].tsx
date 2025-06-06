import { useEffect, useRef } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    useColorScheme,
    View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBlur } from "@/components/ui/HeaderBlur";
import { Loader } from "@/components/ui/Loader";
import { ShareButton } from "@/components/ui/ShareButton";
import { Custom404 } from "@/components/Custom404";
import { TopSection, MainSection } from "@/components/AnimeScreen/Section";
import { Recommendations, Comments } from "@/components/AnimeScreen";

import { useAuth } from "@/context/AuthContext";
import { useAnimeStore } from "@/store/animeStore";
import { useAnimeById } from "@/hooks/useAnimeById";
import { useThemeColor } from "@/hooks/useThemeColor";
import { storage } from "@/utils/storage";
import { createScrollHandler } from "@/utils/createScrollHandler";
import { Colors } from "@/constants/Colors";
import ParallaxScroll from "@/components/ParallaxScroll";
import { useSharedValue } from "react-native-reanimated";

const HEADER_HEIGHT = Dimensions.get("screen").height / 1.5;

export default function AnimeScreen() {
    const { user } = useAuth();
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();

    const { handleClearData, anime } = useAnimeStore();
    const { error, loading, handleFetch } = useAnimeById(id as string);

    const isDark = useColorScheme() === "dark";
    const iconColor = useThemeColor({ light: "black", dark: "white" }, "icon");
    const hideComments = storage.getShowComments();

    const commentsScrollRef = useRef<ScrollView>(null);
    const inputTargetX = useRef(0);
    const inputTargetY = useRef(0);

    const blurValue = useSharedValue(0);
    const scrollHandler = createScrollHandler(blurValue, 50);

    const headerTitle =
        anime?.russian || anime?.english || anime?.japanese || "";
    const headerId = anime?.malId?.toString() ?? "";

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", () => {
            handleClearData();
        });

        return unsubscribe;
    }, [navigation]);


    if (error) {
        return (
            <Custom404
                errorText={error}
                onPress={handleFetch}
                buttonText="Повторить"
            />
        );
    }

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Loader size={46} />
            </ThemedView>
        );
    }

    return (
        <>
            <HeaderBlur
                blurValue={blurValue}
                isDark={isDark}
                iconColor={iconColor}
                title={headerTitle}
                malId={headerId}
                showTitle={false}
                headerRight={
                    <View
                        style={{
                            shadowColor: "black",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 1,
                            shadowRadius: 3,
                        }}
                    >
                        <ShareButton
                            text={headerTitle}
                            id={headerId}
                            iconColor={isDark ? "white" : "black"}
                        />
                    </View>
                }
            />

            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ThemedView style={{ flex: 1 }}>
                    <ParallaxScroll
                        onScroll={scrollHandler}
                        headerHeight={HEADER_HEIGHT}
                        headerBackgroundColor={{
                            dark: Colors.dark.background,
                            light: Colors.light.background,
                        }}
                        headerComponent={<TopSection height={HEADER_HEIGHT} />}
                    >
                        <MainSection />

                        {user && <Recommendations id={Number(id)} />}

                        {user && !hideComments && (
                            <Comments
                                animeId={id.toString()}
                                onLayout={(e) => {
                                    inputTargetX.current = e.nativeEvent.layout.x;
                                    inputTargetY.current = e.nativeEvent.layout.y;
                                }}
                                onFocus={() => {
                                    setTimeout(() => {
                                        commentsScrollRef.current?.scrollTo({
                                            y: inputTargetY.current,
                                            x: inputTargetX.current,
                                            animated: true,
                                        });
                                    }, 500);
                                }}
                            />
                        )}
                    </ParallaxScroll>
                </ThemedView>
            </KeyboardAvoidingView>
        </>
    );
};