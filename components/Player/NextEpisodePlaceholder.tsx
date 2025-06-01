import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

type NextEpisodePlaceholderProps = {
    nextEpisode: string | null;
    episodesCount: number;
};

export const NextEpisodePlaceholder = ({ nextEpisode, episodesCount }: NextEpisodePlaceholderProps) => (
    <View style={styles.container}>
        <ThemedText style={{ color: 'gray', fontSize: 16 }}>
            Серия еще не вышла
        </ThemedText>
        {nextEpisode && (
            <ThemedText style={{ color: 'gray', fontSize: 14 }}>{nextEpisode}</ThemedText>
        )}
        <ThemedText style={{ color: 'gray', fontSize: 12, paddingTop: 10 }}>
            В этой озвучке доступно {episodesCount} серий
        </ThemedText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        height: 275,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
