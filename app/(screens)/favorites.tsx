import {
    Dimensions,
    FlatList,
    LayoutAnimation,
    Modal,
    StyleSheet,
    View,
    useColorScheme,
} from "react-native";
import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { router, Stack } from "expo-router";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHeaderHeight } from "@react-navigation/elements";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "@/context/FavoritesContext";
import { useCallback, useState } from "react";
import { BlurView } from "expo-blur";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Switch, TouchableOpacity } from "react-native-gesture-handler";
import * as ContextMenu from "zeego/context-menu";
import { IconSymbol } from "@/components/ui/IconSymbol";

const screenWidth = Dimensions.get("window").width;
const cardMargin = 10;
const numColumns = 3;
const cardWidth = (screenWidth - (numColumns + 1) * cardMargin) / numColumns;
const cardHeight = cardWidth * 1.5;

export default function FavoritesScreen() {
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === "dark";
    const iconColor = useThemeColor({ light: "black", dark: "white" }, "icon");
    const { favorites, sortFavorite, setSortType, sortType, removeFavorite } = useFavorites();
    const [isOpenSort, setIsOpenSort] = useState<boolean>(false);
    const [isListView, setIsListView] = useState<boolean>(false);

    const handleItemPress = useCallback((itemId: string) => {
        router.push({
            pathname: "/(screens)/[id]",
            params: { id: itemId, isFavorite: "true" },
        });
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: typeof favorites[0] }) => {
            const itemWidth = isListView
                ? screenWidth - 2 * cardMargin
                : cardWidth;
            const itemHeight = isListView ? 120 : cardHeight;

            return (
                <Animated.View
                    layout={LinearTransition.duration(400)}
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                >
                    <ContextMenu.Root>
                        <ContextMenu.Trigger>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => handleItemPress(item.id.toString())}
                                onLongPress={() => null}
                                style={styles.card}
                            >
                                <Image
                                    source={{ uri: item.poster }}
                                    style={{
                                        width: itemWidth,
                                        height: itemHeight,
                                        borderRadius: 10,
                                        backgroundColor: "#ccc",
                                    }}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    transition={600}
                                />

                                {isListView && (
                                    <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }]}>
                                        <ThemedText
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                            lightColor="white"
                                            type="title"
                                            style={{ fontSize: 18, maxWidth: itemWidth - 40, textAlign: "center" }}
                                        >
                                            {item.title}
                                        </ThemedText>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </ContextMenu.Trigger>

                        <ContextMenu.Content>
                            <ContextMenu.Preview>
                                {() => (
                                    <Image
                                        source={{ uri: item.poster }}
                                        style={{
                                            width: cardWidth * 1.75,
                                            height: cardHeight * 1.75,
                                            borderRadius: 10,
                                            backgroundColor: "#ccc",
                                        }}
                                        contentFit="cover"
                                        cachePolicy="memory-disk"
                                    />
                                )}
                            </ContextMenu.Preview>
                            <ContextMenu.Item key="removeItem" onSelect={() => removeFavorite(item.id.toString())}>
                                <ContextMenu.ItemSubtitle>{item.title}</ContextMenu.ItemSubtitle>
                                <ContextMenu.ItemTitle>Удалить</ContextMenu.ItemTitle>
                                <ContextMenu.ItemIcon
                                    ios={{
                                        name: "trash.fill",
                                        hierarchicalColor: { dark: "red", light: "red" },
                                    }}
                                />
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Root>
                </Animated.View>
            );
        },
        [isListView, iconColor]
    );

    const toggleSort = useCallback((type: "asc" | "desc") => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSortType(type);
        sortFavorite();
    }, []);

    const toggleView = () => setIsListView((prev) => !prev);

    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => setIsOpenSort(!isOpenSort)} hitSlop={30}>
                            <FontAwesome6 name="sort" size={22} color={iconColor} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ThemedView style={{ flex: 1 }}>
                <FlatList
                    key={isListView ? "list" : "grid"}
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.id}`}
                    numColumns={isListView ? 1 : 3}
                    contentContainerStyle={favorites.length === 0
                        ? { flex: 1 }
                        : [styles.container, { paddingTop: headerHeight + 20, paddingBottom: insets.bottom }]
                    }
                    columnWrapperStyle={!isListView ? styles.columnWrapper : undefined}
                    ListEmptyComponent={() => (
                        <View style={[styles.emptyContainer, { marginTop: -headerHeight - 20 }]}>
                            <IconSymbol name='server.rack' size={64} color={isDark ? 'white' : 'black'} />
                            <ThemedText type="subtitle" style={{ paddingTop: 10 }}>Result Not Found</ThemedText>
                        </View>
                    )}
                    removeClippedSubviews
                    initialNumToRender={12}
                    maxToRenderPerBatch={12}
                    windowSize={5}
                    updateCellsBatchingPeriod={50}
                    getItemLayout={(_, index) => ({
                        length: isListView ? 130 : cardHeight + cardMargin,
                        offset: (isListView ? 130 : cardHeight + cardMargin) * index,
                        index,
                    })}
                    extraData={sortType}
                    scrollEnabled={favorites.length > 0}
                />
            </ThemedView>

            {isOpenSort && (
                <Animated.View
                    entering={FadeInUp.duration(200)}
                    exiting={FadeOutDown.duration(200)}
                    style={[
                        styles.modalAnimBackground,
                        { backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)" },
                    ]}
                />
            )}

            <Modal
                animationType="slide"
                transparent
                visible={isOpenSort}
                onRequestClose={() => setIsOpenSort(false)}
            >
                <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: insets.bottom }}>
                    <View style={styles.modalFilterContainer}>
                        <TouchableOpacity style={{ height: '100%' }} onPress={() => setIsOpenSort(false)} />
                        <BlurView
                            intensity={60}
                            tint={isDark ? "dark" : "light"}
                            style={[styles.modalFilterBlurBackground, { backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }]}
                        >
                            <ThemedText type="defaultSemiBold" style={{ color: isDark ? "rgba(142, 141, 141, 1)" : "rgba(0,0,0,0.75)", marginBottom: 10 }}>
                                Сортировка
                            </ThemedText>

                            {["asc", "desc"].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    activeOpacity={0.8}
                                    onPress={() => toggleSort(type as "asc" | "desc")}
                                    disabled={sortType === type}
                                    style={styles.filterElementContainer}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                        <FontAwesome6 name={type === "asc" ? "sort-up" : "sort-down"} size={20} color={iconColor} />
                                        <ThemedText type="defaultSemiBold">
                                            {type === "asc" ? "По возрастанию" : "По убыванию"}
                                        </ThemedText>
                                    </View>
                                    {sortType === type && <FontAwesome6 name="check" size={20} color={iconColor} />}
                                </TouchableOpacity>
                            ))}

                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <ThemedText type="defaultSemiBold">Отображение списком</ThemedText>
                                <Switch
                                    value={isListView}
                                    onValueChange={toggleView}
                                    hitSlop={25}
                                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                />
                            </View>
                        </BlurView>
                    </View>
                </View>

                <BlurView
                    style={[styles.modalCloseContainer, { backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }]}
                    intensity={60}
                    tint={isDark ? "dark" : "light"}
                >
                    <TouchableOpacity onPress={() => setIsOpenSort(false)} style={[styles.modalCloseButton, { paddingBottom: insets.bottom + 20 }]}>
                        <ThemedText type="defaultSemiBold">Закрыть</ThemedText>
                    </TouchableOpacity>
                </BlurView>
            </Modal >
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: cardMargin,
    },
    columnWrapper: {
        flexWrap: 'wrap',
        gap: 10,
    },
    card: {
        marginBottom: cardMargin,
        alignItems: "flex-start",
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowOffset: { height: 0, width: 0 },
    },
    overlay: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3.84
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    modalAnimBackground: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
    },
    modalFilterContainer: {
        width: '90%',
        borderRadius: 16,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'flex-end',
    },
    modalFilterBlurBackground: {
        padding: 20,
        borderRadius: 16,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        gap: 10,
    },
    filterElementContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    modalCloseContainer: {
        paddingTop: 10,
        alignItems: 'center',
    },
    modalCloseButton: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    }
});