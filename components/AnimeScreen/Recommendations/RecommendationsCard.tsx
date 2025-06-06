import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Poster } from "../Poster";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { Yammi } from "@/interfaces/Yammi.interfaces";

export const RecommendationsCard = ({ item, isDark }: { item: Yammi; isDark: boolean }) => {
    const { title, year, poster, anime_id, remote_ids, rating } = item;
    const shikimoriId = remote_ids?.shikimori_id;

    const handlePress = () => {
        if (shikimoriId) {
            router.replace({
                pathname: "/(screens)/[id]",
                params: { id: shikimoriId.toString() },
            });
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={styles.container}
        >
            <View style={[styles.shadowContainer, !isDark && styles.shadow]}>
                <Poster
                    key={anime_id.toString()}
                    image={`https:${poster.medium}`}
                    imageStyle={styles.posterImage}
                />
            </View>

            <ThemedText numberOfLines={2} type="title" style={styles.title}>
                {title}
            </ThemedText>

            <View style={styles.metaRow}>
                <ThemedText>{year}</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.dot}>
                    ·
                </ThemedText>
                {!!rating?.shikimori_rating && (
                    <>
                        <ThemedText style={styles.rating}>
                            {rating.shikimori_rating.toFixed(1)}
                        </ThemedText>
                        <IconSymbol name="star.fill" size={16} color="green" />
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200 / 1.55,
        marginRight: 15,
        marginVertical: 10,
    },
    shadowContainer: {
        paddingBottom: 10,
    },
    shadow: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.85,
        shadowRadius: 5,
    },
    posterImage: {
        width: 200 / 1.55,
        height: 300 / 1.55,
        borderRadius: 6,
    },
    title: {
        fontSize: 14,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    dot: {
        fontSize: 18,
    },
    rating: {
        fontSize: 16,
        lineHeight: 20,
        textAlignVertical: "center",
    },
});
