import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { Switch, TouchableOpacity } from "react-native-gesture-handler";
import styles from "./FavoritesScreen.styles";
import Animated, { FadeIn, FadeOutDown } from "react-native-reanimated";

interface Props {
    isOpen: boolean;
    isDark: boolean;
    sortType: "asc" | "desc";
    onClose: () => void;
    onChangeSort: (type: "asc" | "desc") => void;
    isListView: boolean;
    onToggleView: () => void;
}

export const SortModal = ({
    isOpen,
    isDark,
    sortType,
    onClose,
    onChangeSort,
    isListView,
    onToggleView,
}: Props) => {
    const iconColor = isDark ? "white" : "black";

    return (
        <>
            {isOpen && (
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOutDown.duration(200)}
                    style={[
                        styles.modalAnimationBackground,
                        { backgroundColor: isDark ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.45)" },
                    ]}
                />
            )}
            <Modal animationType='slide' transparent visible={isOpen} onRequestClose={onClose}>
                <TouchableOpacity style={{ height: '100%', width: '100%',}} onPress={onClose} />
                <View style={styles.modalContainer}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <BlurView
                            intensity={60}
                            tint={isDark ? "dark" : "light"}
                            style={styles.modalFilterBlurBackground}
                        >
                            <ThemedText type="defaultSemiBold" style={{ marginBottom: 10 }}>
                                Сортировка
                            </ThemedText>

                            {["asc", "desc"].map((type) => (
                                <TouchableOpacity key={type} onPress={() => onChangeSort(type as "asc" | "desc")}>
                                    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                        <IconSymbol
                                            name={
                                                type === sortType
                                                    ? type === "asc"
                                                        ? "arrowtriangle.up.square.fill"
                                                        : "arrowtriangle.down.square.fill"
                                                    : type === "asc"
                                                        ? "arrowtriangle.up.square"
                                                        : "arrowtriangle.down.square"
                                            }
                                            size={32}
                                            color={iconColor}
                                        />
                                        <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                                            {type === "asc" ? "По возрастанию" : "По убыванию"}
                                        </ThemedText>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>Показать списком</ThemedText>
                                <Switch value={isListView} onValueChange={onToggleView} />
                            </View>
                        </BlurView>
                    </View>

                    <BlurView style={{ height: 100, alignItems: "center", paddingTop: 20 }} intensity={60} tint={isDark ? "dark" : "light"}>
                        <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.modalCloseButton}>
                            <ThemedText style={{ fontSize: 18, fontWeight: "500" }}>Закрыть</ThemedText>
                        </TouchableOpacity>
                    </BlurView>
                </View>
            </Modal>
        </>
    )
};
