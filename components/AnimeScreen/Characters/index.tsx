import { CharacterRole } from "@/interfaces/Shikimori.interfaces";
import { FlatList, View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CharacterItem } from "./CharacterItem";

const handleSeeAllPress = (characters: CharacterRole[]) => {
    router.push({
        pathname: '/(screens)/characters/Characters',
        params: { headerText: 'Персонажи', ch: JSON.stringify(characters) },
    });
};

export const Characters = ({ characters }: { characters: CharacterRole[] }) => {
    const iconColor = useThemeColor({ light: 'black', dark: 'white' }, 'icon');

    if (!characters || characters.length === 0) return null;

    return (
        <>
            <View style={styles.header}>
                <ThemedText type="title" style={styles.headerText}>Персонажи</ThemedText>
                <TouchableOpacity onPressOut={() => handleSeeAllPress(characters)} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <IconSymbol name="chevron.right" color={iconColor} size={24} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={characters.slice(0, 7)}
                renderItem={({ item }) => <CharacterItem item={item} />}
                horizontal
                keyExtractor={(item) => item.character.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
    },
    placeholder: {
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: 'gray',
    },
    listContent: {
        gap: 10,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
});
