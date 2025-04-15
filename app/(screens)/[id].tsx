import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GenresList } from "@/components/Genres";
import { ScreenshotsList } from "@/components/Screenshots";
import { Collapsible } from "@/components/Collapsible";
import { useTheme } from "@react-navigation/core";
import { Image } from "expo-image";
import { Player } from "@/components/Player";


const cleanedText = (text: string): string => {
    return text
    .replace(/\[character=[^\]]*]([\s\S]*?)\[\/character]/g, '$1')
    .replace(/\[i]([\s\S]*?)\[\/i]/g, '$1')
    .trim();
};
export default function AnimeScreen() {
    const {id: malId} = useLocalSearchParams();
    const nav = useNavigation();

    const isDark = useTheme().dark;

    const [data, setData] = useState<ShikimoriAnime>();
    const [isLoading, setLoading] = useState<boolean>(true);

    const headerHeight = useHeaderHeight();

    useEffect(() => {
        const fetchData = async () => {
            const props: RequestProps = {
                ids: malId.toString()
            };

            const result = await getAnimeList(props);
            setData(result[0]);
        }
        fetchData().then(() => setLoading(false));
    }, [malId]);

    useEffect(() => {
        nav.setOptions({title: data?.name ?? 'Anime'});
    }, [data]);

    if (isLoading) {
        return (
        <ThemedView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="white"/>
        </ThemedView>
        )
    }

    return (
    <>
        <ThemedView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{
                paddingTop: headerHeight,
                paddingBottom: headerHeight / 2
            }}>
                <Image
                source={{uri: data?.poster.mainUrl}}
                style={{
                    width: '100%',
                    height: 520,
                    position: 'absolute',
                }}
                blurRadius={3}
                priority={'normal'}
                cachePolicy={'disk'}

                />
                <LinearGradient
                colors={
                    isDark ? ['transparent', 'rgba(21,23,24,0.85)', 'rgba(21,23,24,0.95)', 'rgba(21,23,24,1)'] : ['transparent', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,1)']}
                style={{position: 'absolute', width: '100%', height: 520}}
                />

                <Image
                source={{uri: data?.poster.originalUrl}}
                style={{
                    width: 200,
                    height: 300,
                    alignSelf: 'center',
                    borderRadius: 12,
                    shadowRadius: 10,
                    shadowOpacity: 0.3,
                    shadowColor: 'black',
                    shadowOffset: {width: 4, height: 4},
                    marginTop: 50
                }}
                cachePolicy={'disk'}
                priority={'high'}
                />

                <ThemedText type="title" style={{fontSize: 18, alignSelf: 'center', marginTop: 10}}
                            numberOfLines={2}>{data?.japanese}</ThemedText>

                <GenresList
                genres={data?.genres ?? []}
                containerStyle={{gap: 10, paddingHorizontal: 10, paddingBottom: 10}}
                genreStyle={{backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 5, borderRadius: 12}}
                genreTextStyle={{padding: 5}}
                headerTextStyle={{paddingHorizontal: 10}}
                />

                <Collapsible title={'Description'}>
                    <ThemedText
                    type="default"
                    style={{fontSize: 14}}>{cleanedText(data?.description ?? '')}</ThemedText>
                </Collapsible>

                <ScreenshotsList
                images={data?.screenshots ?? []}
                horizontal
                imageStyle={{width: 280, height: 180, borderRadius: 12}}
                containerStyle={{paddingHorizontal: 10, gap: 10, paddingTop: 10}}
                />

                <Player malId={Number(data?.malId)}/>
            </ScrollView>
        </ThemedView>
    </>
    )
}