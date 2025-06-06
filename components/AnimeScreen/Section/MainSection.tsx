import { Player } from "@/components/Player";
import { ThemedText } from "@/components/ThemedText";
import { LayoutChangeEvent, StyleSheet, useColorScheme, View } from "react-native";
import { Characters } from "../Characters";
import { Screenshots } from "../Screenshots";
import { Description } from "../Description";
import { Genres } from "../Genres";
import { useAuth } from "@/context/AuthContext";
import { Bookmark } from "../Bookmark";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { useAnimeStore } from "@/store/animeStore";
import { useFavoriteHandlers } from "@/hooks/favorites/useFavoriteHandlers";
import { TouchableOpacity } from "react-native-gesture-handler";

const handleDescriptionExpand = () => {
    router.push("/(modal)/AnimeDetais");
};

export const MainSection = () => {
    const { id: malId, isFavorite: isFav, status: statusParam } = useLocalSearchParams();
    const { user } = useAuth();
    const {
        ref,
        setTargetY,
        targetY,
        anime,
        worldArtID,
        kinopoiskID,
    } = useAnimeStore();

    const isDark = useColorScheme() === "dark";

    const genres = anime?.genres || [];
    const screenshots = anime?.screenshots || [];
    const characterRoles = anime?.characterRoles || [];

    const {
        isFavorite,
        buttonDisabled,
        animatedStyle,
        handleBookmarkToggle,
        handleRemoveFavorite,
    } = useFavoriteHandlers({
        malId: malId as string,
        anime,
        isFav: isFav as string ?? false,
        statusParam: statusParam as string,
    });

    const handleWatchPress = useCallback(() => {
        ref.current?.scrollTo({ y: targetY, animated: true });
    }, [ref, targetY]);

    const posterUrl = anime?.poster?.originalUrl || "";
    const worldArt = worldArtID ? Number(worldArtID) : undefined;
    const kinopoisk = kinopoiskID ? Number(kinopoiskID) : undefined;

    return (
        <>
            <View style={styles.watchContainer}>
                <TouchableOpacity activeOpacity={0.85} onPress={handleWatchPress}>
                    <ThemedText
                        darkColor="black"
                        lightColor="white"
                        style={[
                            styles.watchButton,
                            { backgroundColor: isDark ? "white" : "black" },
                        ]}
                    >
                        Смотреть
                    </ThemedText>
                </TouchableOpacity>

                {user && (
                    <Bookmark
                        inFavorite={isFavorite}
                        isAnons={anime?.status === "anons"}
                        disabled={buttonDisabled}
                        onAdd={handleBookmarkToggle}
                        onRemove={handleRemoveFavorite}
                        animatedStyle={animatedStyle}
                    />
                )}
            </View>

            <Genres
                genres={genres}
                containerStyle={styles.genreContainer}
                genreStyle={styles.genreItem}
                genreTextStyle={styles.genreItemText}
                headerShow={false}
            />

            <View style={styles.descriptionContainer}>
                <Description
                    text={anime?.description || ""}
                    numberOfLines={3}
                    showExpanded={false}
                    containerStyle={styles.descriptionText}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleDescriptionExpand}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ThemedText style={styles.moreInfo}>Больше информации</ThemedText>
                </TouchableOpacity>
            </View>

            <Screenshots
                images={screenshots}
                horizontal
                imageStyle={styles.screenshotImage}
                containerStyle={styles.screenshotContainer}
            />

            <Characters characters={characterRoles} />

            <Player
                malId={Number(anime?.malId)}
                worldArt_id={worldArt}
                kinopoisk_id={kinopoisk}
                poster={posterUrl}
                onLayout={(e: LayoutChangeEvent) =>
                    setTargetY?.(e.nativeEvent.layout.y + 250)
                }
                nextEpisode={anime?.nextEpisodeAt}
                currentAvailable={anime?.episodesAired}
                episodes={anime?.episodes}
            />
        </>
    );
};

const styles = StyleSheet.create({
    watchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        paddingHorizontal: 45,
    },
    watchButton: {
        padding: 12,
        paddingHorizontal: 22,
        borderRadius: 22,
        flex: 1,
        width: 250,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    genreContainer: {
        marginTop: 10,
        gap: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    genreItem: {
        backgroundColor: "rgba(219, 45, 105, 0.25)",
        padding: 5,
        borderRadius: 12,
    },
    genreItemText: {
        padding: 5,
        color: "#DB2D69",
        fontSize: 14,
        fontWeight: "500",
    },
    descriptionContainer: {
        alignItems: "center",
        paddingHorizontal: 10,
    },
    descriptionText: {
        paddingHorizontal: 0,
    },
    moreInfo: {
        padding: 5,
        fontSize: 14,
        color: "#e7b932",
        textTransform: "uppercase",
        textAlign: "center",
    },
    screenshotImage: {
        width: 280,
        height: 180,
        borderRadius: 12,
    },
    screenshotContainer: {
        paddingHorizontal: 10,
        gap: 10,
        paddingTop: 10,
    },
});
