import React, { useCallback, useEffect, useRef } from "react";
import { Dimensions, useColorScheme, View, Keyboard } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Loader } from "@/components/ui/Loader";
import { FlashList } from "@shopify/flash-list"
import { AnimeCard } from "@/components/SearchScreen/AnimeCard";
import { ListTags } from "@/components/SearchScreen/ListTags";
import { useSearchStore } from "@/store/searchStore";
import { ThemedView } from "@/components/ThemedView";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { useSharedValue } from "react-native-reanimated";
import { createScrollHandler } from "@/utils/createScrollHandler";
import { SearchHeader } from "@/components/ui/SearchHeader";

const numColumns = 2;
const gap = 10;
const paddingHorizontal = 10;
const screenWidth = Dimensions.get("window").width;

const totalHorizontalSpacing = paddingHorizontal * 2 + gap * (numColumns - 1);
const cardWidth = (screenWidth - totalHorizontalSpacing) / numColumns
const cardHeight = (cardWidth * 3) / 2;

export default function SearchScreen() {
    const headerHeight = useHeaderHeight();
    const bottomHeight = useBottomTabBarHeight();
    const isDark = useColorScheme() === 'dark';

    const blurValue = useSharedValue(0);
    const handleScroll = createScrollHandler(blurValue, 400);

    const {
        handleSearch,
        searchResults,
        isLoad,
        lockFetch,
        kind,
        rating,
        duration,
        status,
        order,
        genre
    } = useSearchStore();
    const hasFetchedInitialData = useRef(false);

    const activeFilters: RequestProps = {
        kind: kind as RequestProps['kind'],
        rating: rating as RequestProps['rating'],
        duration: duration as RequestProps['duration'],
        status: status as RequestProps['status'],
        order: order[0] as RequestProps['order'],
        genre: genre as RequestProps['genre']
    };


    useEffect(() => {
        if (!hasFetchedInitialData.current) {
            if (searchResults.length === 0)
                handleSearch('', false);
            hasFetchedInitialData.current = true;
        }
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
                <View style={{ paddingVertical: 20 }}>
                    <Loader size={32} />
                </View>
            );
    }, [isLoad, searchResults.length]);

    const handleLoadMore = useCallback(() => {
        if (!isLoad && !lockFetch && searchResults.length > 0) {
            handleSearch('', true);
        }
    }, [isLoad, lockFetch, searchResults.length, handleSearch]);

    if (isLoad && searchResults.length === 0) {
        return (
            <ThemedView style={{ flex: 1, height: Dimensions.get('screen').height, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Loader size={38} />
            </ThemedView>
        );
    }

    return (
        <>
            <SearchHeader blurValue={blurValue} />
            <ThemedView style={{ flex: 1, paddingVertical: 10 }}>
                <FlashList
                    onScroll={handleScroll}
                    scrollEnabled={searchResults.length > 0}
                    data={searchResults}
                    keyExtractor={(item) => item.malId.toString()}
                    numColumns={2}
                    renderItem={({ item, index }) => (
                        <AnimeCard
                            item={item}
                            index={index}
                            cardHeight={cardHeight}
                            cardWidth={cardWidth}
                            containerStyle={{
                                paddingHorizontal,
                                width: cardWidth,
                                marginRight: (index % numColumns !== numColumns - 1) ? gap : 0,
                                marginBottom: 10,
                                shadowColor: 'black',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84
                            }}
                        />
                    )}
                    estimatedItemSize={cardHeight + 50}
                    contentContainerStyle={{
                        paddingBottom: bottomHeight + 20,
                        paddingTop: headerHeight,
                    }}
                    ListHeaderComponent={() => (
                        <ListTags
                            activeFilters={activeFilters}
                            contentContainer={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: 8,
                                marginBottom: 8
                            }}
                            scrollContentContainer={{ paddingHorizontal }}
                        />
                    )}
                    ListEmptyComponent={listEmpty}
                    ListFooterComponent={footer}
                    keyboardShouldPersistTaps="handled"
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.8}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                />
            </ThemedView>
        </>
    );
};