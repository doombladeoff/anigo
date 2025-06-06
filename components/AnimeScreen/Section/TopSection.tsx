import { Poster } from "@/components/AnimeScreen/Poster"
import { LinearGradient } from "expo-linear-gradient"
import { Dimensions, View, StyleSheet } from "react-native"
import { useTheme } from "@react-navigation/native"
import { useMemo, useRef } from "react"
import { getLinks } from "@/constants/Links"
import { useAnimeStore } from "@/store/animeStore"
import { ThemedText } from "@/components/ThemedText"
import { StatusBadge } from "../StatusBadge"

const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get("screen");

const GRADIENT_COLORS = {
    dark: ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,1)"],
    light: ["rgba(255,255,255,0)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.85)", "rgba(255,255,255,1)"],
}

export const TopSection = ({ height }: { height: number }) => {
    const { dark: isDark } = useTheme();
    const anime = useAnimeStore(state => state.anime)
    const status = useAnimeStore(state => state.status)

    const crunchyId = anime?.crunchyroll.crunchyrollId ?? ""
    const hasTall = anime?.crunchyroll.hasTallThumbnail ?? false
    const hasWide = anime?.crunchyroll.hasWideThumbnail ?? false
    const fallbackImage = useRef<string>(anime?.poster.originalUrl ?? "")

    const gradientColors = useMemo(() => GRADIENT_COLORS[isDark ? "dark" : "light"] as [string, string, ...string[]], [isDark])

    const backgroundImage = useMemo(() => {
        if (hasTall) return getLinks(crunchyId, ScreenWidth * 3, ScreenHeight * 3, "tall").backgroundThumbnail
        if (hasWide) return getLinks(crunchyId, ScreenWidth * 5, ScreenHeight * 3, "wide").backgroundThumbnail
        return fallbackImage.current
    }, [crunchyId, hasTall, hasWide])

    return (
        <View style={{ height }}>
            <LinearGradient
                colors={gradientColors}
                style={[styles.gradient, { height: isDark ? 800 : 100, bottom: 0 }]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <Poster
                image={backgroundImage}
                image2={fallbackImage.current}
                containerStyle={styles.backgroundImageContainer}
                imageStyle={styles.backgroundImage}
                showIcon={false}
                height={hasTall || hasWide ? ScreenHeight : ScreenHeight / 1.55}
                priority="high"
                contentFit="cover"
            />

            {(!hasTall || !hasWide) && (
                <ThemedText style={[styles.russianTitle, { bottom: status ? 50 : 20 }]} numberOfLines={2}>
                    {anime?.russian}
                </ThemedText>
            )}

            <Poster
                image={getLinks(crunchyId).titleThumbnail}
                imageStyle={styles.titlePosterImage}
                containerStyle={styles.crunchPosterContainer}
                showIcon={false}
                contentFit="contain"
                statusBadgeTextSize={16}
                direction="down"
                priority="normal"
                useBackgroundColor={false}
            />

            <StatusBadge
                animated
                animeStatus={status as string}
                statusBadgeTextSize={16}
                direction="down"
                statusBadgeStyle={styles.statusBadge}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    gradient: {
        position: "absolute",
        width: ScreenWidth,
    },
    backgroundImageContainer: {
        width: "100%",
        position: "absolute",
    },
    backgroundImage: {
        width: "100%",
        position: "absolute",
        zIndex: -100,
    },
    russianTitle: {
        position: "absolute",
        width: "100%",
        paddingHorizontal: 20,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 22,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.65,
        shadowRadius: 3,
    },
    crunchPosterContainer: {
        position: "absolute",
        alignItems: "center",
        bottom: 50,
        width: "100%",
    },
    titlePosterImage: {
        height: 70,
        width: 640,
    },
    statusBadge: {
        position: "absolute",
        alignSelf: "center",
        bottom: 15,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
    },
})
