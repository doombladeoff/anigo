import React from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Poster } from "@/components/AnimeScreen/Poster";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { ContextComponent } from "@/components/ContextComponent";
import { animeStatuses } from "@/constants/Status";
import { FavoriteItem } from "@/interfaces/FavoriteItem.interfaces";
import styles from './FavoritesScreen.styles';

interface Props {
    item: FavoriteItem;
    itemWidth: number;
    itemHeight: number;
    isListView: boolean;
    isDark: boolean;
    onItemPress: () => void;
    onCardPress: () => void;
}

export const FavoriteCard = ({
    item,
    itemWidth,
    itemHeight,
    isListView,
    isDark,
    onItemPress,
    onCardPress,
}: Props) => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={{ borderRadius: 10 }}>
            <ContextComponent
                items={[{
                    key: `remove-${item.id}`,
                    title: item.title,
                    subtitle: "Удалить из избранного",
                    iconName: "trash.fill",
                    iconColor: "red",
                    onItemPress
                }]}
                preview={
                    <Image
                        key={item.id}
                        source={{ uri: item.poster }}
                        style={{
                            width: isListView ? itemWidth / 1.5 : itemWidth * 1.75,
                            height: isListView ? itemHeight * 3 : itemHeight * 1.75,
                            borderRadius: 10,
                            backgroundColor: "#ccc",
                        }}
                        contentFit="cover"
                    />
                }
            >
                <TouchableOpacity onPress={onCardPress} style={styles.card}>
                    <Poster
                        key={item.id}
                        image={item.poster}
                        animeStatus={item.status}
                        animated={false}
                        containerStyle={{
                            width: itemWidth,
                            borderRadius: 10,
                            alignItems: "center",
                            marginBottom: 10,

                        }}
                        imageStyle={{
                            width: isListView ? itemWidth : itemWidth - 10,
                            height: itemHeight,
                            borderRadius: 10,
                        }}
                        statusBadgeStyle={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: "absolute",
                            left: isListView ? 0 : 5,
                            right: isListView ? 0 : 5,
                            backgroundColor: animeStatuses[item.status]?.color || "#888",
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                        statusBadgeTextSize={12}
                    />
                    {isListView && (
                        <View style={[
                            styles.overlay,
                            {
                                backgroundColor: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.15)",
                                height: itemHeight,
                                width: itemWidth,
                            }
                        ]}>
                            <ThemedText numberOfLines={2} style={{
                                fontSize: 18, textAlign: "center", fontWeight: "bold", maxWidth: itemWidth - 40,
                                shadowColor: "black",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 1,
                                shadowRadius: 1.85,
                            }}
                                darkColor="white"
                                lightColor="white"
                                type="defaultSemiBold"
                            >
                                {item.title}
                            </ThemedText>
                        </View>
                    )}
                </TouchableOpacity>
            </ContextComponent>
        </Animated.View>
    );
};
