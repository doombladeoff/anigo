import { ThemedText } from "@/components/ThemedText";
import { Genre } from "@/interfaces/Shikimori.interfaces"
import { router } from "expo-router";
import { memo } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface GenreItemProps {
    item: Genre;
    genreStyle?: ViewStyle;
    genreTextStyle?: TextStyle;
}

export const GenreItem = ({ item, genreStyle, genreTextStyle }: GenreItemProps) => {
    return (
        <TouchableOpacity style={genreStyle} key={item.id} activeOpacity={0.8} hitSlop={12}
            onPress={() => {
                router.push({
                    pathname: '/(screens)/animeListByGenre',
                    params: { genre_id: item.id, genre_name: item.russian }
                })
            }}>
            <ThemedText type="subtitle" style={[{ fontSize: 14 }, genreTextStyle]}>
                {item.russian}
            </ThemedText>
        </TouchableOpacity>
    )
};