import React, { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, Stack } from "expo-router";
import { useSearchStore } from "../../../store/searchStore";
import { runOnJS, SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { SearchInput } from "./SearchInput";

export const SearchHeader = React.memo(({ blurValue }: { blurValue: SharedValue<number> }) => {
    const insets = useSafeAreaInsets();
    const iconColor = useThemeColor({ dark: 'white', light: 'black' }, 'icon');
    const textColor = useThemeColor({ dark: 'white', light: 'black' }, 'text');
    const {
        setSearchText,
        handleSearch,
        setQueryText,
        setLockFetch,
        setPage,
    } = useSearchStore();

    const [intensity, setIntensity] = useState(0);

    useAnimatedReaction(
        () => blurValue.value,
        (newVal) => {
            runOnJS(setIntensity)(newVal);
        }, []
    );

    const onDebouncedChange = useCallback((text: string) => {
        setSearchText(text);
        setQueryText(text);
        setPage(1);
        setLockFetch(false);
        handleSearch(text, false, false);
    }, []);

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerBlurEffect: 'none',
                headerTransparent: true,
                header: () => (
                    <BlurView
                        style={[headerStyles.container, { paddingTop: insets.top }]}
                        tint="systemChromeMaterial"
                        intensity={intensity}
                    >
                        <View style={headerStyles.searchContainer}>
                            <SearchInput textColor={textColor} onDebouncedChange={onDebouncedChange} />
                            <TouchableOpacity
                                onPress={() => router.push('/(modal)/SearchFilters')}
                                hitSlop={10}
                            >
                                <MaterialCommunityIcons
                                    name={"filter-check"}
                                    size={30}
                                    color={iconColor}
                                />
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                )
            }} />
        </>
    );
});

const headerStyles = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingHorizontal: 20
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    }
});