import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { useColorScheme, useWindowDimensions, View } from "react-native";
import RenderHTML from 'react-native-render-html';
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { FlashList } from "@shopify/flash-list";
import { Loader } from "@/components/ui/Loader";
import { YummyAPI } from "@/api/Yummy";

const formatDate = (timeStamp: number) => {
    if (!timeStamp) return '';
    const date = new Date(timeStamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} в ${hour}:${min}`;
};

type NewsItem = {
    id: number;
    preview_image: string;
    content_preview: string;
    created_at: number;
};

const Card = memo(function Card({
    item,
    onPress,
    isDark,
    width,
}: {
    item: NewsItem;
    onPress: (item: NewsItem) => void;
    isDark: boolean;
    width: number;
}) {
    const containerStyle = useMemo(() => ({
        borderRadius: 8,
        shadowColor: isDark ? 'white' : 'black',
        shadowOpacity: isDark ? 0.15 : 0.45,
        shadowRadius: 3.84,
        shadowOffset: { width: 0, height: 0 },
    }), [isDark]);

    return (
        <TouchableOpacity
            style={{ marginBottom: 15 }}
            activeOpacity={0.8}
            onPress={() => onPress(item)}
        >
            <ThemedView style={containerStyle}>
                <View style={{ padding: 6, gap: 5 }}>
                    <Image
                        source={{ uri: item.preview_image }}
                        style={{
                            width: '100%',
                            height: 150,
                            borderRadius: 4,
                            backgroundColor: 'gray',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        transition={400}
                        cachePolicy="disk"
                        priority="high"
                    >
                        <IconSymbol name="photo" size={32} color="white" />
                    </Image>
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: item.content_preview }}
                        baseStyle={{ color: isDark ? 'white' : 'black', maxHeight: 75 }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <IconSymbol name="clock" size={18} color={isDark ? 'white' : 'black'} />
                        <ThemedText style={{ fontSize: 14 }}>{formatDate(item.created_at)}</ThemedText>
                    </View>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
});

export default function NewsScreen() {
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const bottomHeight = useBottomTabBarHeight();
    const width = useWindowDimensions().width;
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === 'dark';

    const fetchNews = useCallback(async (pageToLoad: number) => {
        setLoading(true);
        try {
            const news = await YummyAPI.news.getNews(pageToLoad);
            if (pageToLoad === 0) {
                setNewsData(news);
            } else {
                setNewsData((prev) => [...prev, ...news]);
            }
        } catch (e) {
            console.error('Failed to fetch news', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews(0);
    }, [fetchNews]);

    const handlePress = useCallback((item: NewsItem) => {
        router.navigate({
            pathname: '/(tabs)/(news)/[id]',
            params: { id: item.id, data: JSON.stringify(item) }
        });
    }, []);

    const handleLoadMore = useCallback(() => {
        if (loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNews(nextPage);
    }, [loading, page, fetchNews]);

    const renderItem = useCallback(({ item }: { item: NewsItem }) => (
        <Card item={item} onPress={handlePress} isDark={isDark} width={width} />
    ), [handlePress, isDark, width]);

    return (
        <ThemedView style={{ flex: 1 }}>
            <FlashList
                data={newsData}
                renderItem={renderItem}
                estimatedItemSize={250}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    paddingTop: insets.top,
                    paddingBottom: bottomHeight + 20,
                    paddingHorizontal: 10,
                }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.9}
                ListFooterComponent={loading ? <Loader size={32} /> : null}
                extraData={isDark}
            />
        </ThemedView>
    );
}
