import { ScrollView, TextStyle, ViewStyle } from "react-native";
import { Genre } from "@/interfaces/Shikimori.interfaces";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSearchContext } from "@/context/SearchContext";

interface GenresListProps {
    genres: Genre[];
    containerStyle?: ViewStyle;
    genreStyle?: ViewStyle;
    genreTextStyle?: TextStyle;
    headerShow?: boolean;
    headerText?: string;
    headerTextStyle?: TextStyle;
}

export const GenresList = ({
    genres,
    containerStyle,
    genreStyle,
    genreTextStyle,
    headerShow = true,
    headerText = 'Genres',
    headerTextStyle
}: GenresListProps) => {
    const { setSearchResults } = useSearchContext();
    return (
        <>
            {headerShow && <ThemedText type="title" style={[{
                fontSize: 20,
                marginBottom: 10
            }, headerTextStyle]}>{headerText}</ThemedText>}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={containerStyle}>
                {genres.map((genre, index) => {
                    return (
                        <TouchableOpacity style={genreStyle} key={index} activeOpacity={0.8} hitSlop={12}
                            onPress={() => {
                                setSearchResults([]);
                                router.push({
                                    pathname: '/(screens)/animeListByGenre',
                                    params: { genre_id: genre.id, genre_name: genre.russian }
                                })
                            }}>
                            <ThemedText
                                type="subtitle"
                                style={[{ fontSize: 14 }, genreTextStyle]}
                                key={index}
                            >{genre.russian}</ThemedText>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </>
    )
}