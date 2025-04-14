import { useEffect, useState } from "react";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { OrderEnum } from "@/constants/OrderEnum";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { Dimensions, FlatList, Image, Pressable, View, ViewStyle } from "react-native";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

interface AnimeListProps {
    headerText?: string;
    headerShow?: boolean;
    containerStyle?: ViewStyle;
    headerContentStyle?: ViewStyle;
}

const screenWidth = Dimensions.get('window').width;
const imageWidth = screenWidth * 0.4;
const imageHeight = imageWidth * 1.5;


export const AnimeList = ({
                              headerText = 'Header',
                              headerShow = true,
                              containerStyle,
                              headerContentStyle
                          }: AnimeListProps) => {
    const iconColor = useThemeColor({dark: 'white', light: 'dark'}, 'icon');
    const [animeList, setAnimeList] = useState<ShikimoriAnime[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const props: RequestProps = {
                kind: ['tv'],
                status: ['ongoing', "released"],
                limit: 5,
                duration: ['D', "F"],
                rating: ['pg_13', "r"],
                order: OrderEnum.ranked,
            };

            const result = await getAnimeList(props);
            setAnimeList(result);
        };

        fetchData()
        .then(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        const arr = new Array(4).fill(null)
        return (
        <View style={{flexDirection: 'row', gap: 10}}>
            {arr.map((_, index) => (
            <View key={index} style={{
                width: imageWidth,
                height: imageHeight,
                borderRadius: 12,
                backgroundColor: 'gray',
            }}/>
            ))}
        </View>
        )
    }

    const _renderItem = ({item}: {item: ShikimoriAnime}) => (
    <Pressable onPress={() => router.navigate({pathname: '/(screens)/[id]', params: {id: item.malId}})}>
        <Image
        source={{uri: item.poster.originalUrl}}
        style={{width: imageWidth, height: imageHeight, borderRadius: 12}}
        />
    </Pressable>

    );

    return (
    <View>
        {headerShow && (
        <View style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8
        }, headerContentStyle]}>
            <ThemedText type='title'>{headerText}</ThemedText>
            <FontAwesome6 name="chevron-right" size={24} color={iconColor}/>
        </View>
        )}

        <FlatList
        data={animeList}
        renderItem={_renderItem}
        contentContainerStyle={containerStyle}
        keyExtractor={(item) => item.malId.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        />
    </View>
    )
}