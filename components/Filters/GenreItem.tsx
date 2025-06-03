import React, { memo, useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

type Props = {
    id: string;
    name: { en: string; ru: string };
    selected: boolean;
    onToggle: (id: string) => void;
    iconColor: string
};

export const GenreItem = ({ id, name, selected, onToggle, iconColor }: Props) => {
    const handlePress = useCallback(() => {
        onToggle(id);
    }, [id, onToggle]);

    return (
        <TouchableOpacity onPress={handlePress} style={styles.genreButton}>
            <IconSymbol
                name={selected ? "checkmark.square.fill" : "square"}
                size={28}
                color={selected ? iconColor : 'gray'}
            />
            <View>
                <ThemedText style={styles.genreText}>
                    {name.ru}
                    {__DEV__ && <ThemedText> id({id})</ThemedText>}
                </ThemedText>
                <ThemedText style={styles.genreTextEn}>{name.en}</ThemedText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    genreButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    genreText: {
        fontSize: 16,
        fontWeight: "600",
    },
    genreTextEn: {
        fontSize: 12,
        color: "#aaa",
    },
});
