import { CharacterRole } from "@/interfaces/Shikimori.interfaces";
import { FlatList, View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export const Characters = ({ characters }: { characters: CharacterRole[] }) => {
    const iconColor = useThemeColor({ light: 'black', dark: 'white' }, 'icon');

    if (!characters || characters.length === 0) return null;

    const handleCharacterPress = (id: number) => {
        router.push({ pathname: '/characters/[id]', params: { id } });
    };

    const handleSeeAllPress = () => {
        router.push({
            pathname: '/(screens)/characters/Characters',
            params: { headerText: 'Персонажи', ch: JSON.stringify(characters) },
        });
    };

    const renderItem = ({ item }: { item: CharacterRole }) => {
        const posterUrl = item.character?.poster?.mainUrl || item.character?.poster?.originalUrl

        const name = item.character?.russian || item.character?.name;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.characterContainer}
                onPress={() => handleCharacterPress(item.character.id)}
            >
                <View style={styles.imgShadow}>
                    <Image source={{ uri: posterUrl }} style={styles.characterImage} transition={300}>
                        {!posterUrl && <IconSymbol name='questionmark' size={62} color={'white'} />}
                    </Image>
                </View>
                <ThemedText type="subtitle" numberOfLines={1} style={styles.characterName}>
                    {name}
                </ThemedText>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.header}>
                <ThemedText type="title" style={styles.headerText}>Персонажи</ThemedText>
                <TouchableOpacity onPressOut={handleSeeAllPress} hitSlop={styles.hitSlop}>
                    <IconSymbol name="chevron.right" color={iconColor} size={24} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={characters.slice(0, 10)}
                renderItem={renderItem}
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
    hitSlop: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
    },
    characterContainer: {
        maxWidth: 100,
        paddingVertical: 5,
        gap: 5,
        alignItems: 'center',
    },
    characterImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgShadow: {
        shadowColor: 'black',
        shadowOpacity: 0.65,
        shadowRadius: 3.25,
        shadowOffset: { width: 0, height: 0 },
    },
    characterName: {
        fontSize: 16,
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
