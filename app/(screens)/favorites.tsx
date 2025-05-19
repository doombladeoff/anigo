import { Dimensions, FlatList, Modal, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { router, Stack } from "expo-router";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FavoriteItem } from "@/utils/storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "@/context/FavoritesContext";
import { useCallback, useState } from "react";
import { BlurView } from "expo-blur";
import { useThemeColor } from "@/hooks/useThemeColor";
import ContextMenu from "react-native-context-menu-view"

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const cardMarginHorizontal = 10;
const cardWidth = (screenWidth - (numColumns + 1) * cardMarginHorizontal) / numColumns;
const cardHeight = cardWidth * 1.5;

export default function FavoritesScreen() {
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === 'dark';
    const iconColor = useThemeColor({ light: 'black', dark: 'white' }, 'icon');
    const { favorites, sortFavorite, setSortType, sortType, removeFavorite } = useFavorites();
    const [isOpenSort, setIsOpenSort] = useState<boolean>(false);

    const renderItem = useCallback(({ item }: { item: FavoriteItem }) => {

        return (
            <View key={item.id} style={[styles.card, { width: cardWidth }]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        router.push({
                            pathname: "/(screens)/[id]",
                            params: { id: item.id, isFavorite: "true" },
                        })
                    }
                >
                    <ContextMenu
                        title={'Избранное'}
                        actions={[
                            {
                                title: 'Удалить из избранного',
                                systemIcon: 'trash.fill',
                                inlineChildren: true,
                                iconColor:'red',
                                destructive: true,
                        
                            },
                        ]}
                        previewBackgroundColor={'transparent'}
                        preview={
                            <Image
                                source={{ uri: item.poster }}
                                style={[styles.image, {backgroundColor: 'transparent'}]}
                                contentPosition="center"
                                contentFit="cover"
                                transition={600}
                            />
                        }
                        onPress={() => {
                            removeFavorite(item.id.toString());
                        }}
                    >
                        <Image
                            source={{ uri: item.poster }}
                            style={styles.image}
                            contentFit="cover"
                            cachePolicy='memory-disk'
                            transition={600}
                        />
                    </ContextMenu>
                </TouchableOpacity>
                <ThemedText numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                    {item.title}
                </ThemedText>
            </View>
        );
    }, [iconColor, favorites]);

    return (
        <>
            <Stack.Screen options={{
                headerRight: () => {
                    return (
                        <TouchableOpacity onPress={() => setIsOpenSort(!isOpenSort)} hitSlop={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                            <FontAwesome6 name="sort" size={22} color={iconColor} />
                        </TouchableOpacity>
                    )
                }
            }} />
            <ThemedView style={{ flex: 1 }}>
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}`}
                    numColumns={3}
                    contentContainerStyle={favorites.length == 0 ? { flex: 1 } : [styles.container, {
                        paddingTop: headerHeight + 20,
                        paddingBottom: insets.bottom
                    }]}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[styles.emptyContainer, { marginTop: -headerHeight - 20 }]}>
                                <Entypo name="cross" size={34} color="white"
                                    style={{ position: 'absolute', transform: [{ translateX: -6 }, { translateY: -27 }] }} />
                                <FontAwesome6 name="magnifying-glass" size={70} color="white" />
                                <ThemedText type={'subtitle'} style={{ paddingTop: 10 }}>Result Not Found</ThemedText>
                            </View>
                        )
                    }}
                    removeClippedSubviews
                    initialNumToRender={12}
                    maxToRenderPerBatch={12}
                />
            </ThemedView>


            {isOpenSort && <Animated.View
                entering={FadeInUp.duration(200)}
                exiting={FadeOutDown.duration(200)}
                style={[styles.modalAnimBackground, { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)' }]} />
            }


            <Modal
                animationType='slide'
                transparent={true}
                visible={isOpenSort}
                onRequestClose={() => setIsOpenSort(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom }}>
                    <View style={styles.modalFilterContainer}>
                        <BlurView
                            intensity={60}
                            style={[styles.modalFilterBlurBackground, { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }]}
                            tint={isDark ? 'dark' : 'light'}
                        >
                            <ThemedText type='defaultSemiBold' style={{ color: isDark ? "rgba(142, 141, 141, 1)" : "rgba(0,0,0,0.75)", marginBottom: 10 }}>Сортировка</ThemedText>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setSortType('asc');
                                    sortFavorite();
                                }}
                                disabled={sortType === 'asc'}
                                style={styles.filterElementContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <FontAwesome6 name="sort-up" size={20} color={iconColor} />
                                    <ThemedText type="defaultSemiBold" >По возростонию</ThemedText>
                                </View>
                                {sortType === 'asc' && <FontAwesome6 name="check" size={20} color={iconColor} />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setSortType('desc');
                                    sortFavorite();
                                }}
                                disabled={sortType === 'desc'}
                                style={styles.filterElementContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <FontAwesome6 name="sort-down" size={20} color={iconColor} />
                                    <ThemedText type="defaultSemiBold">По убыванию</ThemedText>
                                </View>
                                {sortType === 'desc' && <FontAwesome6 name="check" size={20} color={iconColor} />}
                            </TouchableOpacity>
                        </BlurView>
                    </View>
                </View>

                <BlurView
                    style={[styles.modalCloseContainer, { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }]}
                    intensity={60}
                    tint={isDark ? 'dark' : 'light'}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsOpenSort(false)} style={[styles.modalCloseButton, { paddingBottom: insets.bottom + 20 }]}>
                        <ThemedText type="defaultSemiBold">Закрыть</ThemedText>
                    </TouchableOpacity>
                </BlurView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: cardMarginHorizontal,
    },
    columnWrapper: {
        flexWrap: 'wrap',
        gap: 10,
    },
    card: {
        marginBottom: cardMarginHorizontal,
        alignItems: "flex-start",
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowOffset: { height: 0, width: 0 },
    },
    image: {
        width: cardWidth,
        height: cardHeight,
        borderRadius: 10,
        backgroundColor: "#ccc",
    },
    title: {
        marginTop: 8,
        textAlign: 'left',
        fontSize: 14,
        fontWeight: '500'
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