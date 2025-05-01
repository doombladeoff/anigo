import { router, Stack, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { FlatList, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSearchContext } from "@/context/SearchContext";
import { Loader } from "@/components/ui/Loader";
import { useEffect } from "react";
import { OrderEnum } from "@/constants/OrderEnum";

export default function AnimeListByGenre() {
    const headerHeight = useHeaderHeight();
    const {genre_id, genre_name} = useLocalSearchParams();
    const {searchResults, isLoad, handleSearch, loadMore, page} = useSearchContext();

    useEffect(() => {
        if (genre_id) {
            handleSearch('', {genre: genre_id.toString(), order: OrderEnum.ranked});
        }
    }, [genre_id]);

    if (isLoad && searchResults.length === 0) {
        return (
            <ThemedView style={styles.loaderContainer}>
                <Loader size={64}/>
            </ThemedView>
        );
    }

    return (
        <>
            <Stack.Screen options={{headerTitle: genre_name.toString()}}/>
            <ThemedView style={styles.container}>
                <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => item.malId.toString() + index.toString()}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.card}>
                                <Image
                                    source={{uri: item.poster?.originalUrl}}
                                    priority="high"
                                    transition={400}
                                    style={styles.image}
                                />
                                <View style={styles.infoContainer}>
                                    <View style={styles.titleContainer}>
                                        <ThemedText numberOfLines={1} type="title" style={styles.title}>
                                            {item.russian}
                                        </ThemedText>
                                        {item.status === 'anons' ? (
                                            <ThemedText style={styles.anons}>Анонс</ThemedText>
                                        ) : (
                                            <ThemedText style={styles.detailsText}>
                                                Серий: {item.episodes} | {item.rating}
                                            </ThemedText>
                                        )}
                                    </View>

                                    {item.status !== 'anons' && (
                                        <View style={styles.ratingContainer}>
                                            <AntDesign name="star" size={20} color="gold"/>
                                            <ThemedText>{item.score}</ThemedText>
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        style={styles.btn}
                                        onPress={() =>
                                            router.push({
                                                pathname: '/(screens)/[id]',
                                                params: {id: item.malId},
                                            })
                                        }
                                    >
                                        <ThemedText style={styles.btnText}>Смотреть</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    contentContainerStyle={[styles.flatListContainer, {paddingTop: headerHeight, paddingBottom: 30}]}
                    ListFooterComponent={() => isLoad && <View><Loader size={34}/></View>}
                    keyboardShouldPersistTaps="handled"
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.75}
                />
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'rgb(23,22,22)',
        borderRadius: 12,
        elevation: 5,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: 'red',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 0},
    },
    image: {
        width: 120,
        height: 180,
        borderRadius: 10,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 8,
    },
    titleContainer: {
        flex: 1,
        gap: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    anons: {
        backgroundColor: '#FF6F61',
        color: '#fff',
        borderRadius: 15,
        paddingVertical: 4,
        paddingHorizontal: 12,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    detailsText: {
        fontSize: 16,
        textAlign: 'justify',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    btn: {
        backgroundColor: '#FF6F61',
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    flatListContainer: {
        paddingTop: 20,
        gap: 10,
    },
    loaderWrapper: {
        width: '100%',
        justifyContent: 'center',
        paddingVertical: 20,
    },
});
