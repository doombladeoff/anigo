import { useCallback, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { router } from "expo-router";
import { Dimensions, View, useColorScheme } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSharedValue } from "react-native-reanimated";
import { createScrollHandler } from "@/utils/createScrollHandler";
import { SortModal } from "@/components/Favorites/SortModal";
import { FavoriteCard } from "@/components/Favorites/FavoritesCard";
import { FavoriteItem } from "@/interfaces/FavoriteItem.interfaces";
import { HeaderBlur } from "@/components/ui/HeaderBlur";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useHeaderHeight } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width } = Dimensions.get('screen');
const handleItemPress = (itemId: string, status: string) => {
    router.push({
        pathname: "/(screens)/[id]",
        params: { id: itemId, isFavorite: "true", status },
    });
};

export default function FavoritesScreen() {
    const headerHeight = useHeaderHeight();
    const { favorites, removeFavorite, sortType, setSortType, sortFavorite } = useFavorites();

    const isDark = useColorScheme() === "dark";
    const iconColor = useThemeColor({ dark: "white", light: "black" }, "icon");

    const [isListView, setIsListView] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const blurValue = useSharedValue(0);
    const handleScroll = createScrollHandler(blurValue, 300);

    const numColumns = isListView ? 1 : 3;
    const spacing = 0;
    const itemWidth = isListView ? width : (width - spacing * (numColumns + 0)) / numColumns;
    const itemHeight = isListView ? itemWidth / 3 : itemWidth * 1.44;

    const renderItem = useCallback(
        ({ item }: { item: FavoriteItem }) => (
            <FavoriteCard
                item={item}
                itemWidth={isListView ? itemWidth - 20 : itemWidth}
                itemHeight={itemHeight}
                isListView={isListView}
                isDark={isDark}
                onItemPress={() => removeFavorite(item.id.toString())}
                onCardPress={() => handleItemPress(item.id.toString(), item.status)}
            />
        ),
        [isListView, itemWidth, itemHeight, isDark, removeFavorite]
    );

    const handleSortChange = (type: "asc" | "desc") => {
        setSortType(type);
        sortFavorite();
    };

    return (
        <View style={{ flex: 1 }}>
            <FlashList
                key={isListView ? "list" : "grid"}
                data={favorites}
                renderItem={renderItem}
                estimatedItemSize={itemHeight + 50}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={{
                    paddingHorizontal: isListView ? 10 : 0,
                    paddingTop: headerHeight + 10,
                    paddingBottom: headerHeight / 2,
                }}
                numColumns={numColumns}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <HeaderBlur
                        blurValue={blurValue}
                        isDark={isDark}
                        iconColor={iconColor}
                        title="Избранное"
                        malId=""
                        headerRight={
                            <TouchableOpacity
                                onPress={() => setIsModalOpen(true)}
                                hitSlop={{ top: 30, right: 30, bottom: 30, left: 30 }}
                            >
                                <IconSymbol
                                    name="arrow.up.arrow.down.square.fill"
                                    size={30}
                                    color={iconColor}
                                />
                            </TouchableOpacity>
                        }
                    />
                }
            />

            <SortModal
                isOpen={isModalOpen}
                isDark={isDark}
                sortType={sortType || "desc"}
                onClose={() => setIsModalOpen(false)}
                onChangeSort={handleSortChange}
                isListView={isListView}
                onToggleView={() => setIsListView((prev) => !prev)}
            />
        </View>
    );
};
