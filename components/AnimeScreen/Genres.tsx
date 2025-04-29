import { ScrollView, TextStyle, View, ViewStyle } from "react-native";
import { Genre } from "@/interfaces/Shikimori.interfaces";
import { ThemedText } from "@/components/ThemedText";

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
    return (
        <>
            {headerShow && <ThemedText type="title" style={[{
                fontSize: 20,
                marginBottom: 10
            }, headerTextStyle]}>{headerText}</ThemedText>}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={containerStyle}>
                {genres.map((genre, index) => {
                    return (
                        <View style={genreStyle} key={index}>
                            <ThemedText
                                type="subtitle"
                                style={[{fontSize: 14}, genreTextStyle]}
                                key={index}
                            >{genre.russian}</ThemedText>
                        </View>
                    )
                })}
            </ScrollView>
        </>
    )
}