import React, { useMemo, useCallback, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { FilterGroup } from "@/components/Filters/FilterGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { OrderEnum } from "@/constants/OrderEnum";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useSearchStore } from "@/store/searchStore";
import { KindValueType, StatusValueType, DurationValueType, RatingValueType, OrderValueType } from "@/store/searchStore";
import { genresMap } from "@/constants/Genres";
import { LinearGradient } from "expo-linear-gradient";


export default function FilterListScreen() {
    const headerHeight = useHeaderHeight();
    const iconColor = useThemeColor({ dark: "white", light: "black" }, "icon");
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const enableScroll = () => setScrollEnabled(false);
    const disableScroll = () => setScrollEnabled(true);
    const {
        kind, setKind,
        status, setStatus,
        duration, setDuration,
        rating, setRating,
        order, setOrder,
        queryText,
        handleSearch,
        setLockFetch,
        setGenre,
        year, setYear
    } = useSearchStore();

    const [range, setRange] = useState(year)
    useEffect(() => {
        const timer = setTimeout(() => {
            setScrollEnabled(true);
            if (year[0] !== range[0] || year[1] !== range[1]) {
                setYear(range);
            }

        }, 1000);
        return () => clearTimeout(timer);
    }, [range])

    useEffect(() => {
        setRange(year)
    }, [year])

    const toggle = <T extends string>(
        selected: T[],
        value: T,
        setter: (newValue: T[]) => void
    ) => {
        setter(
            selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value]
        );
    };

    const handleKindSelect = useCallback((value: KindValueType) => {
        toggle(kind, value, setKind);
    }, [kind]);

    const handleStatusSelect = useCallback((value: StatusValueType) => {
        toggle(status, value, setStatus);
    }, [status]);

    const handleDurationSelect = useCallback((value: DurationValueType) => {
        toggle(duration, value, setDuration);
    }, [duration]);

    const handleRatingSelect = useCallback((value: RatingValueType) => {
        toggle(rating, value, setRating);
    }, [rating]);

    const handleOrderSelect = useCallback((value: OrderValueType) => {
        setOrder([value]);
    }, []);

    const kindOptions = useMemo(() => [
        { value: "tv", label: "ТВ" },
        { value: "movie", label: "Фильм" },
        { value: "ova", label: "OVA" },
        { value: "ona", label: "ONA" },
        { value: "special", label: "Спецвыпуск" },
        { value: "tv_special", label: "ТВ Спецвыпуск" },
    ], []);

    const statusOptions = useMemo(() => [
        { value: "ongoing", label: "Онгоинг" },
        { value: "released", label: "Завершён" },
        { value: "anons", label: "Анонс" },
    ], []);

    const durationOptions = useMemo(() => [
        { value: "S", label: "Меньше 10 минут" },
        { value: "D", label: "Меньше 30 минут" },
        { value: "F", label: "Больше 30 минут" },
    ], []);

    const ratingOptions = useMemo(() => [
        { value: "pg_13", label: "13+" },
        { value: "r", label: "16+" },
        { value: "r_plus", label: "18+" },
    ], []);

    const orderOptions = useMemo(() => [
        { value: OrderEnum.ranked, label: "По рейтингу" },
        { value: OrderEnum.popularity, label: "По популярности" },
        { value: OrderEnum.name, label: "По названию" },
        { value: OrderEnum.aired_on, label: "По дате выхода" },
        { value: OrderEnum.random, label: "Случайно" },
    ], []);

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView
                scrollEnabled={scrollEnabled}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: headerHeight * 2,
                }}
            >
                <View style={[styles.header, { paddingTop: headerHeight + 10 }]}>
                    <ThemedText style={{ fontSize: 18, fontWeight: "bold", paddingHorizontal: 20 }}>Жанры</ThemedText>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        onPress={() => router.push("/(modal)/SearchFilters/GenreScreen")}
                        style={{
                            paddingHorizontal: 20
                        }}
                    >
                        <IconSymbol name="chevron.right" size={18} color={iconColor} />
                    </TouchableOpacity>
                </View>
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingVertical: 10, paddingLeft: 20 }}
                    >
                        {useSearchStore.getState().genre.map((id) => {
                            const genreLabel = genresMap[id as unknown as keyof typeof genresMap].ru || id;
                            return (
                                <TouchableOpacity
                                    key={id}
                                    onPress={() => {
                                        if (!id) return;
                                        const next = new Set(useSearchStore.getState().genre);
                                        if (next.has(id)) {
                                            next.delete(id);
                                            setGenre?.(Array.from(next));
                                        }
                                    }}
                                    style={{
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 20,
                                        backgroundColor: 'rgba(219, 45, 105, 0.45)',
                                        marginBottom: 8,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4
                                    }}
                                >
                                    <IconSymbol name='xmark' size={12} color={'white'} />
                                    <ThemedText style={{ fontSize: 14, color: 'rgba(219, 45, 105, 1)' }}>
                                        {genreLabel}
                                    </ThemedText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <FilterGroup
                        title="Тип"
                        options={kindOptions}
                        selected={kind}
                        onSelect={handleKindSelect}
                        iconColor={iconColor}
                    />

                    <View style={{ marginVertical: 10 }}>
                        <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>Год</ThemedText>
                        <MultiSlider
                            values={range}
                            isMarkersSeparated
                            onValuesChange={setRange}
                            onValuesChangeStart={enableScroll}
                            onValuesChangeFinish={disableScroll}
                            step={1}
                            max={new Date().getFullYear()}
                            min={1990}
                            sliderLength={Dimensions.get('screen').width - 60}
                            allowOverlap={false}
                            snapped
                            minMarkerOverlapDistance={40}
                            containerStyle={{ paddingHorizontal: 0, marginBottom: 20, left: 10 }}
                            selectedStyle={{ backgroundColor: '#DB2D69', padding: 2 }}
                            unselectedStyle={{ backgroundColor: 'gray', padding: 2 }}
                            customMarkerLeft={() => (
                                <View style={{ alignItems: 'center' }}>
                                    <View
                                        hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                                        style={{
                                            top: 17,
                                            width: 25,
                                            height: 25,
                                            borderRadius: 100,
                                            backgroundColor: '#DB2D69',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 2,
                                        }}
                                    >
                                        <View style={{ width: 13, height: 13, borderRadius: 100, backgroundColor: '#EFECEC' }} />
                                    </View>
                                    <ThemedText style={{ marginTop: 8, zIndex: 1, top: 12, left: 5 }}>{range[0]}</ThemedText>
                                </View>

                            )}
                            customMarkerRight={() => (
                                <View style={{ alignItems: 'center' }}>
                                    <View
                                        hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                                        style={{
                                            top: 17,
                                            width: 25,
                                            height: 25,
                                            borderRadius: 100,
                                            backgroundColor: '#DB2D69',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 2,
                                        }}
                                    >
                                        <View style={{ width: 13, height: 13, borderRadius: 100, backgroundColor: '#EFECEC' }} />
                                    </View>
                                    <ThemedText style={{ marginTop: 8, zIndex: 1, top: 12, right: 5 }}>{range[1]}</ThemedText>
                                </View>
                            )}

                        />
                    </View>

                    <FilterGroup
                        title="Статус"
                        options={statusOptions}
                        selected={status}
                        onSelect={handleStatusSelect}
                        iconColor={iconColor}
                    />
                    <FilterGroup
                        title="Сортировка"
                        options={orderOptions}
                        selected={order}
                        onSelect={handleOrderSelect}
                        iconColor={iconColor}
                    />
                    <FilterGroup
                        title="Длительность"
                        options={durationOptions}
                        selected={duration}
                        onSelect={handleDurationSelect}
                        iconColor={iconColor}
                    />
                    <FilterGroup
                        title="Рейтинг"
                        options={ratingOptions}
                        selected={rating}
                        onSelect={handleRatingSelect}
                        iconColor={iconColor}
                    />

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setLockFetch(false);
                            handleSearch(queryText);
                            router.back();
                        }}
                    >
                        <LinearGradient
                            colors={['#DB2D69', '#DB372D']}
                            style={styles.applyButton}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            locations={[1, 0.65]}
                        >
                            <ThemedText style={{ fontWeight: "bold" }} lightColor={'white'}>Применить</ThemedText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    applyButton: {
        marginTop: 10,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
});
