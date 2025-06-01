import { StyleSheet, View } from "react-native";
import { SelectPicker } from "../SelectPicker";
import { ThemedText } from "../ThemedText";

type PlayerControlsProps = {
    selectedEpisode: string | null;
    selectedCaster: { title: string } | null;
    episodeOptions: { label: string; value: string }[];
    voicerOptions: { label: string; value: string }[];
    onEpisodeSelect: (value: string, id: number) => void;
    onVoicerSelect: (value: string) => void;
    isDark: string;
};

export const EpisodeVoiceSelector = ({
    selectedEpisode,
    selectedCaster,
    episodeOptions,
    voicerOptions,
    onEpisodeSelect,
    onVoicerSelect,
    isDark
}: PlayerControlsProps) => (
    <View style={styles.playerHeader}>
        <SelectPicker title="Серия" options={episodeOptions} onSelect={(value) => onEpisodeSelect(value, Number(value))}>
            <View style={[styles.selectItem, { shadowColor: isDark }]}>
                <ThemedText lightColor={'white'}>Серия</ThemedText>
                <ThemedText lightColor={'white'}>{selectedEpisode || "Не выбрано"}</ThemedText>
            </View>
        </SelectPicker>

        <SelectPicker title="Озвучка" options={voicerOptions} onSelect={onVoicerSelect}>
            <View style={[styles.selectItem, { shadowColor: isDark }]}>
                <ThemedText lightColor={'white'}>Озвучка</ThemedText>
                <ThemedText lightColor={'white'}>{selectedCaster?.title || "Выбрать"}</ThemedText>
            </View>
        </SelectPicker>
    </View>
);

const styles = StyleSheet.create({
    playerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
    },
    selectItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
        backgroundColor: 'rgba(0,0,0,1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 7,
        borderRadius: 15,
    }
});

