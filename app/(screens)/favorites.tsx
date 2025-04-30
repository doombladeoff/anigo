import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FavoriteItem } from "@/utils/storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "@/context/FavoritesContext";

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const cardMarginHorizontal = 10;
const cardWidth = (screenWidth - (numColumns + 1) * cardMarginHorizontal) / numColumns;
const cardHeight = cardWidth * 1.5;

export default function FavoritesScreen() {
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const {favorites} = useFavorites();

    const renderItem = ({item}: { item: FavoriteItem }) => {

        return (
            <View key={item.id} style={[styles.card, {width: cardWidth}]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        router.push({
                            pathname: "/(screens)/[id]",
                            params: {id: item.id, isFavorite: "true"},
                        })
                    }
                >
                    <Image
                        source={{uri: item.poster}}
                        style={styles.image}
                        contentFit="cover"
                        transition={400}
                    />
                </TouchableOpacity>
                <ThemedText numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                    {item.title}
                </ThemedText>
            </View>
        );
    };

    return (
        <ThemedView style={{flex: 1}}>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
                numColumns={3}
                contentContainerStyle={favorites.length == 0 ? {flex: 1} : [styles.container, {
                    paddingTop: headerHeight + 20,
                    paddingBottom: insets.bottom
                }]}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={() => {
                    return (
                        <View style={[styles.emptyContainer, {marginTop: -headerHeight - 20}]}>
                            <Entypo name="cross" size={34} color="white"
                                    style={{position: 'absolute', transform: [{translateX: -6}, {translateY: -27}]}}/>
                            <FontAwesome6 name="magnifying-glass" size={70} color="white"/>
                            <ThemedText type={'subtitle'} style={{paddingTop: 10}}>Result Not Found</ThemedText>
                        </View>
                    )
                }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: cardMarginHorizontal,
    },
    columnWrapper: {
        flexWrap: 'wrap',
        gap: 10,
    },
    card: {
        marginBottom: cardMarginHorizontal,
        alignItems: "flex-start",
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowOffset: {height: 0, width: 0},
    },
    image: {
        width: cardWidth,
        height: cardHeight,
        borderRadius: 10,
        backgroundColor: "#ccc",
    },
    title: {
        marginTop: 8,
        textAlign: 'left',
        fontSize: 14,
        fontWeight: '500'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    }
});