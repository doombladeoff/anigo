import { router, Stack, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { Dimensions, StyleSheet, useColorScheme, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSearchContext } from "@/context/SearchContext";
import { Loader } from "@/components/ui/Loader";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { OrderEnum } from "@/constants/OrderEnum";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { runOnJS, useAnimatedReaction, useSharedValue, withTiming } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";

const numColumns = 2;
const gap = 10;
const { width: screenWidth } = Dimensions.get("window");
const cardWidth = useMemo(() => (screenWidth - gap * (numColumns - 1) - 20) / numColumns, [screenWidth]);
const cardHeight = useMemo(() => (cardWidth * 3) / 2, [cardWidth]);

const AnimatedCounter = memo(function AnimatedCounter({ value, isDark }: { value: number, isDark: boolean }) {
    const animatedValue = useSharedValue(0);
    const [displayedValue, setDisplayedValue] = useState(0);

    useEffect(() => {
        animatedValue.value = withTiming(value, { duration: 1000 });
    }, [value]);

    useAnimatedReaction(
        () => Math.round(animatedValue.value),
        (currentValue, previousValue) => {
            if (currentValue !== previousValue) {
                runOnJS(setDisplayedValue)(currentValue);
            }
        },
        []
    );

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconSymbol name="eye" size={22} color={isDark ? 'white' : 'black'} />
            <ThemedText style={{ marginLeft: 6 }}>{displayedValue}</ThemedText>
        </View>
    );
});

const AnimeCard = memo(function AnimeCard({
    item,
    index,
    onPress,
    isDark,
    cardWidth,
    cardHeight,
}: {
    item: ShikimoriAnime;
    index: number;
    onPress: (id: number) => void;
    isDark: boolean;
    cardWidth: number;
    cardHeight: number;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={{
                width: cardWidth,
                marginRight: (index % numColumns !== numColumns - 1) ? gap : 0,
                marginBottom: gap,
            }}
            onPress={() => onPress(item.malId)}
        >
            {console.log(isDark)}
            <View style={{
                shadowColor: isDark ? 'white' : 'black',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isDark ? 0.25 : 1,
                shadowRadius: 3.84,
                marginHorizontal: 5
            }}>
                <Image
                    key={item.id.toString()}
                    source={{ uri: item.poster.main2xUrl }}
                    priority="high"
                    transition={600}
                    style={{
                        width: cardWidth,
                        height: cardHeight,
                        borderRadius: 6,
                        backgroundColor: 'gray',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <IconSymbol name="photo" size={32} color="white" />
                </Image>
            </View>

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
});

export default function AnimeListByGenre() {
    const isDark = useColorScheme() === 'dark';
    const headerHeight = useHeaderHeight();
    const { genre_id, genre_name } = useLocalSearchParams();
    const { searchResults, isLoad, handleSearch, loadMore } = useSearchContext();

    useEffect(() => {
        if (genre_id) {
            handleSearch('', { genre: genre_id.toString(), order: OrderEnum.ranked });
        }
    }, [genre_id, handleSearch]);

    const handleItemPress = useCallback((id: number) => {
        router.push({
            pathname: '/(screens)/[id]',
            params: { id },
        });
    }, []);

    const listEmpty = useCallback(() => (
        <View style={{ height: Dimensions.get('screen').height - 300, padding: 10, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <AntDesign name="closecircleo" size={38} color={isDark ? 'white' : 'black'} />
            <ThemedText type='subtitle' style={{ fontSize: 28 }}>Пусто</ThemedText>
        </View>
    ), [isDark]);

    const footer = useCallback(() => {
        if (isLoad)
            return (
                <View>
                    <Loader size={34} />
                </View>
            );
        return null;
    }, [isLoad]);

    const renderItem = useCallback(
        ({ item, index }: { item: ShikimoriAnime, index: number }) => (
            <AnimeCard
                item={item}
                index={index}
                onPress={handleItemPress}
                isDark={isDark}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
            />
        ),
        [handleItemPress, isDark, cardWidth, cardHeight]
    );

    const keyExtractor = useCallback((item: ShikimoriAnime) => item.malId.toString(), []);

    if (isLoad && searchResults.length === 0) {
        return (
            <ThemedView style={styles.loaderContainer}>
                <Loader size={44} />
            </ThemedView>
        );
    }

    return (
        <>
            <Stack.Screen options={{
                headerTitle: genre_name?.toString() || "",
                headerRight: () => (
                    <AnimatedCounter value={searchResults.length} isDark={isDark} />
                )
            }} />
            <ThemedView style={styles.container}>
                <FlashList
                    scrollEnabled={searchResults.length > 0}
                    data={searchResults}
                    keyExtractor={keyExtractor}
                    numColumns={numColumns}
                    renderItem={renderItem}
                    estimatedItemSize={cardHeight + 50}
                    contentContainerStyle={{
                        paddingBottom: 20,
                        paddingTop: headerHeight,
                        paddingHorizontal: 10,
                    }}
                    ListEmptyComponent={listEmpty}
                    ListFooterComponent={footer}
                    keyboardShouldPersistTaps="handled"
                    onEndReached={loadMore}
                    onEndReachedThreshold={1}
                />
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 8,
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
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});