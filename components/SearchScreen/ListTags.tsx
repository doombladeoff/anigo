import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { useMemo } from "react";
import { genresMap } from "@/constants/Genres";

type ListTagsProps = {
    activeFilters: RequestProps;
    scrollContentContainer: ViewStyle;
    contentContainer: ViewStyle;
}

const filterValueLabels: Record<string, string> = {
    tv: "ТВ",
    movie: "Фильм",
    ova: "OVA",
    ona: "ONA",
    special: "Спецвыпуск",
    tv_special: "ТВ Спецвыпуск",
    ongoing: "Онгоинг",
    released: "Завершён",
    latest: "Новое",
    anons: "Анонс",
    S: "Меньше 10 минут",
    D: "Меньше 30 минут",
    F: "Больше 30 минут",
    pg_13: "13+",
    r: "16+",
    r_plus: "18+",
    ranked: "По рейтингу",
    popularity: "По популярности",
    name: "По названию",
    aired_on: "По дате выхода",
    random: "Случайно",
    ranked_shiki: "По рейтингу Shikimori",
    created_at: "По дате добавления ↑",
    created_at_desc: "По дате добавления ↓",
    "!ancient": "Очень старые (исключено)",
};

type ItemProps = {
    text: any;
}

const Item = ({ text }: ItemProps) => {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.tagContainer}>
            <ThemedText style={{ color: 'rgba(219, 45, 105, 1)' }}>
                {text}
            </ThemedText>
        </TouchableOpacity>
    )
}

export const ListTags = ({ activeFilters, contentContainer, scrollContentContainer }: ListTagsProps) => {
    const memoizedActiveFilters = useMemo(() => (
        Object.entries(activeFilters).filter(
            ([, value]) =>
                (Array.isArray(value) && value.length > 0) ||
                (typeof value === 'string' && value !== '') ||
                (typeof value === 'number' && value !== undefined && value !== null)
        )
    ), [activeFilters]);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={scrollContentContainer}>
            <View style={contentContainer}>
                {memoizedActiveFilters.flatMap(([key, value]) => {
                    if (value === '!ancient') return null;
                    const values = Array.isArray(value) ? value : [value];
                    if (key === 'genre') {
                        return values.map((id, idx) => (
                            <Item
                                key={`genre-${id}-${idx}`}
                                text={genresMap[id as keyof typeof genresMap]?.ru || id}
                            />
                        ));
                    }
                    return values.map((v, idx) => (
                        <Item
                            key={`${key}-${v}-${idx}`}
                            text={filterValueLabels[v] || v}
                        />
                    ));
                })}
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    tagContainer: {
        backgroundColor: 'rgba(219, 45, 105, 0.45)',
        borderRadius: 8,
        padding: 6,
        margin: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    }
});