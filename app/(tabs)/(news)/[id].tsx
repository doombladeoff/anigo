import { Text, useWindowDimensions, View, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import React, { useEffect, useState, useMemo } from 'react';
import RenderHTML, { HTMLContentModel, HTMLElementModel } from 'react-native-render-html';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { WebView } from 'react-native-webview';
import { useColorScheme } from 'react-native';
import { YummyAPI } from '@/api/Yummy';

type NewsDetailData = {
    content: string;
};

function extractCleanText(html: string | undefined) {
    if (!html) return '';

    let cleaned = html.replace(/<img[^>]*>/gi, '');
    cleaned = cleaned.replace(/<a\s+[^>]*href=["']https:\/\/new\.yummyani\.me[^"']*["'][^>]*>(.*?)<\/a>/gi, (_, text) => text);

    return cleaned.trim();
}

export default function NewsDetail() {
    const { data: sharedData } = useLocalSearchParams();
    const router = useRouter();
    const data = useMemo(() => JSON.parse(sharedData as string), [sharedData]);

    const [detailData, setDetailData] = useState<NewsDetailData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<boolean>(false);

    const isDark = useColorScheme() === 'dark';

    const windowWidth = useWindowDimensions().width;

    const customHTMLElementModels = useMemo(() => ({
        iframe: HTMLElementModel.fromCustomModel({
            tagName: 'iframe',
            contentModel: HTMLContentModel.mixed,
            mixedUAStyles: {
                width: '100%',
                height: 600,
                backgroundColor: 'red',
            },
        }),
    }), []);

    const renderers = useMemo(() => ({
        iframe: ({ tnode }: any) => {
            const src = tnode.domNode.attribs.src || '';
            const height = Number(tnode.domNode.attribs.height) || 200;
            return (
                <WebView
                    source={{ uri: src }}
                    style={{ width: windowWidth - 32, height, marginVertical: 10 }}
                    javaScriptEnabled
                    domStorageEnabled
                    scalesPageToFit
                />
            );
        },
    }), [windowWidth]);

    const renderersProps = useMemo(() => ({
        iframe: {
            enableExperimentalPercentWidth: true,
        },
    }), []);

    useEffect(() => {
        let isMounted = true;

        const fetchDetail = async () => {
            setLoading(true);
            setLoadError(false);
            try {
                const post = await YummyAPI.news.getPost(data.id)
                if (isMounted) {
                    setDetailData(post);
                }
            } catch (error) {
                console.error('Error loading news detail:', error);
                if (isMounted) setLoadError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDetail();

        return () => {
            isMounted = false;
        };
    }, [data.id]);

    // Меморизация стилей, зависящих от темы
    const textStyle = useMemo(() => ({
        ...styles.text,
        color: isDark ? 'white' : 'black',
    }), [isDark]);

    // Анимированные компоненты вне рендера
    const AImage = useMemo(() => Animated.createAnimatedComponent(Image), []);
    const AText = useMemo(() => Animated.createAnimatedComponent(Text), []);

    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.8}
                            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <View style={styles.closeButton}>
                                <IconSymbol name="xmark" size={18} color="white" />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ThemedView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    <AImage
                        sharedTransitionTag="sharedTag"
                        source={{ uri: data.preview_image }}
                        style={styles.image}
                        cachePolicy="disk"
                        priority="high"
                        transition={400}
                        contentFit='cover'
                    >
                        <IconSymbol name="photo" size={32} color="white" />
                    </AImage>

                    <AText style={textStyle} entering={FadeInLeft.duration(400).delay(800)}>
                        {data.title}
                    </AText>

                    <Animated.View entering={FadeInDown.duration(400).delay(800)} style={styles.card}>
                        {loading && <Text style={{ color: isDark ? 'white' : 'black', textAlign: 'center' }}>Загрузка...</Text>}
                        {loadError && <Text style={{ color: 'red', textAlign: 'center' }}>Ошибка загрузки</Text>}
                        {!loading && !loadError && detailData && (
                            <RenderHTML
                                contentWidth={windowWidth}
                                source={{ html: extractCleanText(detailData.content) }}
                                enableExperimentalMarginCollapsing={true}
                                customHTMLElementModels={customHTMLElementModels}
                                renderers={renderers}
                                renderersProps={renderersProps}
                                ignoredDomTags={['script']}
                                baseStyle={{ color: isDark ? 'white' : 'black' }}
                            />
                        )}
                    </Animated.View>
                </ScrollView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 100,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    card: {
        borderRadius: 10,
        paddingHorizontal: 10,
    },
});
