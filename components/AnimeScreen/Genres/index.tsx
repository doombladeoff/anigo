import { FlatList, TextStyle, ViewStyle } from "react-native";
import { Genre } from "@/interfaces/Shikimori.interfaces";
import { ThemedText } from "@/components/ThemedText";
import { GenreItem } from "./GenreItem";

interface GenresListProps {
    genres: Genre[];
    containerStyle?: ViewStyle;
    genreStyle?: ViewStyle;
    genreTextStyle?: TextStyle;
    headerShow?: boolean;
    headerText?: string;
    headerTextStyle?: TextStyle;
}

export const Genres = ({
    genres,
    containerStyle,
    genreStyle,
    genreTextStyle,
    headerShow = true,
    headerText = 'Genres',
    headerTextStyle
}: GenresListProps) => {
    return (
        <>
            {headerShow && <ThemedText type="title" style={[{
                fontSize: 20,
                marginBottom: 10
            }, headerTextStyle]}>{headerText}</ThemedText>}
            <FlatList
                horizontal
                data={genres}
                contentContainerStyle={containerStyle}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <GenreItem
                        item={item}
                        genreTextStyle={genreTextStyle}
                        genreStyle={genreStyle}
                    />
                )}
                keyExtractor={(item) => `${item.name}-${item.id}`}
            />
        </>
    )
};