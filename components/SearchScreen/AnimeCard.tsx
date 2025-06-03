import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Poster } from "../AnimeScreen/Poster";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { ViewStyle } from "react-native";
import { router } from "expo-router";

const handleItemPress = (id: number) => {
    router.push({
        pathname: '/(screens)/[id]',
        params: { id },
    });
};

export const AnimeCard = ({ item, index, containerStyle, cardHeight, cardWidth }: {
    item: ShikimoriAnime;
    index: number;
    containerStyle: ViewStyle;
    cardWidth: number
    cardHeight: number
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={containerStyle}
            onPress={() => handleItemPress(item.id)}
        >
            <Poster
                image={item.poster.main2xUrl}
                key={item.id.toString() + 'poster'}
                imageStyle={{
                    width: cardWidth,
                    height: cardHeight,
                    borderRadius: 6,
                    backgroundColor: 'gray',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            />
            <View style={styles.infoContainer}>
                <ThemedText numberOfLines={2} style={styles.title}>
                    {item.russian}
                </ThemedText>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                    {item.status === 'anons' ? (
                        <ThemedText style={styles.anons}>Анонс</ThemedText>
                    ) : (
                        <>
                            <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
                                {item.airedOn.year}
                            </ThemedText>
                            <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>·</ThemedText>
                            <View style={styles.ratingContainer}>
                                <AntDesign name="star" size={16} color="green" />
                                <ThemedText
                                    style={{ color: 'green', fontSize: 14 }}
                                    type="defaultSemiBold"
                                >
                                    {item.score}
                                </ThemedText>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    infoContainer: {
        flex: 1,
        paddingTop: 5
    },
    title: {
        fontSize: 16,
        flexShrink: 1,
        flexWrap: 'wrap',
        fontWeight: '500',
        lineHeight: 20
    },
    anons: {
        fontSize: 12,
        backgroundColor: 'red',
        borderRadius: 12,
        textAlign: 'center',
        padding: 6,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    btn: {
        backgroundColor: 'rgb(86,70,70)',
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
        alignSelf: 'flex-start',
    }
});