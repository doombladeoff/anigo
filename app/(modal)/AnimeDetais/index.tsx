import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBlur } from "@/components/ui/HeaderBlur";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAnimeStore } from "@/store/animeStore";
import { cleanedText } from "@/utils/cleanTextTags";
import { createScrollHandler } from "@/utils/createScrollHandler";
import { router } from "expo-router";
import { View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { status } from '@/constants/Status'
import { useMemo } from "react";
import { Related } from "@/interfaces/Shikimori.interfaces";
import { useHeaderHeight } from "@react-navigation/elements";

const DetailItem = ({ title, value }: { title: string; value: string }) => (
    <View style={{ gap: 5 }}>
        <ThemedText type='defaultSemiBold'>{title}</ThemedText>
        <ThemedText type='defaultSemiBold' style={{ color: 'gray' }}>{value}</ThemedText>
    </View>
);

const RelatedAnimeItem = ({ item }: { item: Related }) => {
    if (!item?.anime) return null;
    return (
        <TouchableOpacity
            onPress={() => {
                router.back();
                router.push({
                    pathname: '/(screens)/[id]',
                    params: { id: item.anime.id.toString() },
                });
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, justifyContent: 'space-between' }}>
                <ThemedText>{item.relationText}: </ThemedText>
                <ThemedText type="link" style={{ flex: 1, maxWidth: '60%' }}>{item.anime.name}</ThemedText>
            </View>
        </TouchableOpacity>
    );
};

export default function AnimeModalDetaisScreen() {
    const { anime } = useAnimeStore();
    const headerHeight = useHeaderHeight();
    const blurValue = useSharedValue(0);
    const handleScroll = createScrollHandler(blurValue, 300);
    const iconColor = useThemeColor({ dark: 'white', light: 'black' }, 'icon');

    const description = useMemo(() => cleanedText(anime?.description || ''), [anime?.description]);

    const renderArray = useMemo(() => [
        { title: 'Статус', value: anime?.status ? status[anime.status].ru : '', show: !!anime?.status },
        { title: 'Другие названия', value: anime?.synonyms?.join(',\n') || '', show: !!anime?.synonyms?.length },
        { title: 'Выходит с', value: `${anime?.airedOn?.day}.${anime?.airedOn?.month}.${anime?.airedOn?.year}`, show: !!anime?.airedOn?.day },
        { title: 'Вышло', value: `${anime?.releasedOn?.day}.${anime?.releasedOn?.month}.${anime?.releasedOn?.year}`, show: !!anime?.releasedOn?.day },
        { title: 'Продолжительность', value: `${anime?.episodes} Эпизодов, ${anime?.duration} минуты`, show: !!anime?.episodes },
        { title: 'Озвучка', value: anime?.fandubbers?.join(', ') || '', show: !!anime?.fandubbers?.length },
        {
            title: 'Награды',
            value: anime?.crunchyroll?.crunchyAwards?.length 
                ? anime.crunchyroll.crunchyAwards.map((v, i) => `${i + 1}. ${v.text}`).join('\n') || ''
                : '',
            show: !!anime?.crunchyroll?.crunchyAwards?.length
        },
    ], [anime]);

    return (
        <ThemedView style={{ flex: 1 }}>
            <HeaderBlur
                blurValue={blurValue}
                title={anime?.russian as string}
                iconColor={iconColor}
                showTitle={false}
                headerLeft={
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
                        <IconSymbol name='xmark' size={24} color={iconColor} />
                    </TouchableOpacity>
                }
            />
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: headerHeight + 10, paddingBottom: 40, gap: 20, paddingHorizontal: 10 }}>
                <ThemedText type='title' style={{ fontSize: 22 }}>{anime?.russian}</ThemedText>
                {__DEV__ && <ThemedText>SHIKI ID: {anime?.id}</ThemedText>}
                {!!description && <ThemedText type='defaultSemiBold' style={{ lineHeight: 20, fontSize: 16 }}>{description}</ThemedText>}

                {renderArray.map((item, index) =>
                    item.show ? (
                        <DetailItem key={index} title={item.title} value={item.value || ''} />
                    ) : null
                )}

                {anime && anime?.related?.length > 0 && (
                    <View style={{ gap: 5 }}>
                        <ThemedText type='defaultSemiBold'>Связанное</ThemedText>
                        {anime.related.map((item, index) => (
                            <RelatedAnimeItem key={index} item={item} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </ThemedView >
    )
}