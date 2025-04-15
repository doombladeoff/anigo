import { useEffect, useState } from "react";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { OrderEnum } from "@/constants/OrderEnum";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { Dimensions, FlatList, Pressable, TextStyle, View, ViewStyle } from "react-native";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { Image } from "expo-image";
import { isLoading } from "expo-font";

interface AnimeListProps {
    headerText?: string;
    headerTextStyle?: TextStyle;
    headerShow?: boolean;
    containerStyle?: ViewStyle;
    headerContentStyle?: ViewStyle;
    showType?: 'Top' | 'OnScreens';
    animeList?: ShikimoriAnime[];
    isLoading?: boolean;
}

const screenWidth = Dimensions.get('window').width;
const imageWidth = screenWidth * 0.36;
const imageHeight = imageWidth * 1.44;


export const AnimeList = ({
                              headerText = 'Header',
                              headerTextStyle,
                              headerShow = true,
                              containerStyle,
                              headerContentStyle,
                              showType = 'Top',
                              animeList,
                              isLoading = false
                          }: AnimeListProps) => {
    const iconColor = useThemeColor({dark: 'white', light: 'dark'}, 'icon');

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
    <Pressable onPress={() => router.push({pathname: '/(screens)/[id]', params: {id: item.malId}})}>
        <Image
        source={{uri: item.poster.originalUrl}}
        style={{
            width: imageWidth,
            height: imageHeight,
            borderRadius: 12,
        }}
        transition={400}
        cachePolicy={"disk"}
        priority={'high'}
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
            <ThemedText type='title' style={headerTextStyle}>{headerText}</ThemedText>
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