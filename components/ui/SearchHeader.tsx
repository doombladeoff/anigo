import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSearchContext } from "@/context/SearchContext";
import { useEffect, useRef, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ThemedText } from "@/components/ThemedText";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

const screenWidth = Dimensions.get("screen").width;

const kindOptions: { value: NonNullable<RequestProps['kind']>[number]; label: string }[] = [
    {value: "tv", label: "ТВ"},
    {value: "movie", label: "Фильм"},
    {value: "ova", label: "OVA"},
    {value: "ona", label: "ONA"},
    {value: "special", label: "Спецвыпуск"},
    {value: "tv_special", label: "ТВ Спецвыпуск"},
    {value: "music", label: "Музыкальное"},
];

const statusOptions: { value: NonNullable<RequestProps['status']>[number]; label: string }[] = [
    {value: "ongoing", label: "Онгоинг"},
    {value: "released", label: "Завершён"},
    {value: "latest", label: "Новое"},
    {value: "anons", label: "Анонс"},
];

const durationOptions: { value: NonNullable<RequestProps['duration']>[number]; label: string }[] = [
    {value: "S", label: "Меньше 10 минут"},
    {value: "D", label: "Меньше 30 минут"},
    {value: "F", label: "Больше 30 минут"},
];

const ratingOptions: { value: NonNullable<RequestProps['rating']>[number]; label: string }[] = [
    {value: "none", label: "Нет"},
    {value: "g", label: "Все возрасты"},
    {value: "pg", label: "6+"},
    {value: "pg_13", label: "13+"},
    {value: "r", label: "16+"},
    {value: "r_plus", label: "18+"},
    {value: "rx", label: "18+ (RX)"},
];

const createToggleHandler = <T extends string>(
    selected: T[] | undefined,
    setSelected: (v: T[]) => void,
    value: T
) => {
    const isSelected = selected?.includes(value) ?? false;
    const next = isSelected
        ? selected?.filter((v) => v !== value)
        : [...(selected ?? []), value];
    setSelected(next as T[]);
};

const FilterGroup = <T extends string>({
    title,
    options,
    selected,
    onSelect,
    iconColor
}: {
    title: string;
    options: { value: T; label: string }[];
    selected?: T[];
    onSelect: (value: T) => void;
    iconColor: string;
}) => (
    <View style={{marginBottom: 20}}>
        <ThemedText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>{title}</ThemedText>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
            {options.map(({value, label}) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={value}
                    onPress={() => onSelect(value)}
                    style={{
                        paddingVertical: 6,
                        paddingHorizontal: 0,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5
                    }}
                >
                    <MaterialCommunityIcons
                        name={selected?.includes(value) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={30}
                        color={iconColor}
                    />
                    <ThemedText>{label}</ThemedText>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

const cleanObject = <T extends object>(obj: T): Partial<T> => {
    const cleanObj: Partial<T> = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (
            value === undefined ||
            value === null ||
            (Array.isArray(value) && value.length === 0)
        ) return;

        cleanObj[key as keyof T] = value;
    });

    return cleanObj;
};

export const SearchHeader = () => {
    const insets = useSafeAreaInsets();
    const headerHeight = useRef(0);
    const bottomHeight = useBottomTabBarHeight();
    const iconColor = useThemeColor({dark: 'white', light: 'black'}, 'icon');
    const textColor = useThemeColor({dark: 'white', light: 'black'}, 'text');
    const [isPressed, setIsPressed] = useState(false);
    const isDark = useColorScheme();

    const {handleSearch} = useSearchContext();
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText, setDebouncedSearchText] = useState("");

    const [modalShow, setModalShow] = useState<boolean>(false);

    const [kind, setKind] = useState<RequestProps['kind']>([]);
    const [status, setStatus] = useState<RequestProps['status']>([]);
    const [duration, setDuration] = useState<RequestProps['duration']>([]);
    const [rating, setRating] = useState<RequestProps['rating']>([]);

    const getCleanedFilters = () => {
        const selectedFilters: RequestProps = {
            kind,
            status,
            duration,
            rating
        };
        return cleanObject(selectedFilters);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchText]);

    useEffect(() => {
        if (debouncedSearchText) {
            const cleanedFilters = getCleanedFilters();
            handleSearch(debouncedSearchText, cleanedFilters);
        }
    }, [debouncedSearchText, handleSearch])

    const handleApply = () => {
        const cleanedFilters = getCleanedFilters();

        if (debouncedSearchText.length === 0) {
            setModalShow(false);
        } else {
            handleSearch(debouncedSearchText, cleanedFilters);
            setModalShow(false);
        }
    };


    const hasAnyFilter = (kind?.length ?? 0) > 0 || (status?.length ?? 0) > 0 || (duration?.length ?? 0) > 0 || (rating?.length ?? 0) > 0;
    return (
        <>
            <BlurView
                style={[headerStyles.container, {paddingTop: insets.top}]}
                tint="systemChromeMaterial"
                intensity={100}
                onLayout={(e) => headerHeight.current = e.nativeEvent.layout.height}
            >
                <View style={headerStyles.searchContainer}>
                    <View style={headerStyles.searchFieldContainer}>
                        <AntDesign name="search1" size={20} color={iconColor}/>
                        <TextInput
                            placeholder="Найти аниме..."
                            onChangeText={(text) => setSearchText(text)}
                            style={[headerStyles.searchInput, {color: textColor}]}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setModalShow(true)
                        }}
                        hitSlop={10}
                    >
                        <MaterialCommunityIcons
                            name={hasAnyFilter ? "filter-check" : "filter"}
                            size={30}
                            color={iconColor}
                        />
                    </TouchableOpacity>
                </View>
            </BlurView>

            <Modal
                animationType={'slide'}
                presentationStyle={'formSheet'}
                transparent={false}
                visible={modalShow}
                onRequestClose={() => setModalShow(false)}
            >
                <Pressable style={{flex: 1}} onPress={() => setModalShow(false)}/>
                <ThemedView style={modalStyle.container}>
                    <View style={{flex: 1, justifyContent: 'flex-end', width: '100%'}}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 10
                        }}>
                            <ThemedText type='subtitle'>Фильтр</ThemedText>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setModalShow(false)}
                                hitSlop={10}
                            >
                                <MaterialCommunityIcons name="close-circle-outline" size={30} color={iconColor}/>
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                            <FilterGroup
                                title="Тип"
                                options={kindOptions}
                                selected={kind}
                                onSelect={(v) => createToggleHandler(kind, setKind, v)}
                                iconColor={iconColor}
                            />
                            <FilterGroup
                                title="Статус"
                                options={statusOptions}
                                selected={status}
                                onSelect={(v) => createToggleHandler(status, setStatus, v)}
                                iconColor={iconColor}
                            />
                            <FilterGroup
                                title="Длительность"
                                options={durationOptions}
                                selected={duration}
                                onSelect={(v) => createToggleHandler(duration, setDuration, v)}
                                iconColor={iconColor}
                            />
                            <FilterGroup
                                title="Рейтинг"
                                options={ratingOptions}
                                selected={rating}
                                onSelect={(v) => createToggleHandler(rating, setRating, v)}
                                iconColor={iconColor}
                            />
                        </ScrollView>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 10,
                            paddingBottom: bottomHeight / 2
                        }}>

                            <Pressable
                                onPress={handleApply}
                                style={({pressed}) => [modalStyle.filterBtn,
                                    {
                                        flex: 1,
                                        backgroundColor: isDark === 'dark' ? (pressed ? 'white' : 'transparent') : (pressed ? 'black' : 'transparent'),
                                        borderWidth: 2,
                                        borderColor: isDark === 'dark' ? 'white' : 'black'
                                    },
                                    modalStyle.filterBtn,
                                ]}
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                            >
                                <Text
                                    style={{color: isPressed ? (isDark == 'dark' ? 'black' : 'white') : (isDark === 'dark' ? 'white' : 'black')}}

                                >Применить</Text>
                            </Pressable>

                            <TouchableOpacity
                                onPress={() => {
                                    setKind([]);
                                    setStatus([]);
                                    setRating([]);
                                    setRating([]);
                                }}
                                style={[modalStyle.filterBtn, {flex: 1, backgroundColor: '#F44336'}]}
                                activeOpacity={0.8}
                            >
                                <ThemedText type={'defaultSemiBold'}>Сбросить</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ThemedView>
            </Modal>
        </>
    )
};

const headerStyles = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingHorizontal: 20
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    searchFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(108,108,108,0.6)',
        borderRadius: 8,
        padding: 10
    },
    searchInput: {
        width: screenWidth - 140,
        height: 20,
        borderRadius: 8,
        flexDirection: 'row',
        fontSize: 16
    },
});

const modalStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        padding: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flex: 1,
    },
    filterBtn: {
        padding: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
})