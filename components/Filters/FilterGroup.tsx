import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "../ui/IconSymbol";
import { memo } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSearchStore } from "@/store/searchStore";
import { genresMap } from "@/constants/Genres";

type FilterGroupProps<T extends string> = {
    title: string;
    options: { value: T; label: string }[];
    selected?: T[];
    onSelect: (value: T) => void;
    iconColor: string;
}

export const FilterGroup = memo(function FilterGroup<T extends string>({
    title,
    options,
    selected,
    onSelect,
    iconColor
}: FilterGroupProps<T>) {
    return (
        <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>{title}</ThemedText>
            <View style={{ flexDirection: "row", flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                {options.map(({ value, label }) => (
                    <TouchableOpacity
                        key={`${title}-${value}`}
                        activeOpacity={0.8}
                        onPress={() => onSelect(value)}
                        style={styles.optionButton}
                    >
                        {title !== "Сортировка" ? (
                            <IconSymbol name={selected?.includes(value) ? 'checkmark.square.fill' : 'square'} size={30} color={selected?.includes(value) ? iconColor : 'gray'} />
                        ) : (
                            <IconSymbol name={selected?.includes(value) ? 'smallcircle.filled.circle' : 'circle'} size={22} color={selected?.includes(value) ? iconColor : 'gray'} />
                        )}
                        <ThemedText>{label}</ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}) as React.MemoExoticComponent<React.FC<FilterGroupProps<any>>>;

const styles = StyleSheet.create({
    optionButton: {
        paddingVertical: 6,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    }
});