import { CharacterRole } from "@/interfaces/Shikimori.interfaces";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Poster } from "../Poster";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

const handleCharacterPress = (id: number) => {
    router.push({ pathname: '/characters/Character', params: { id } });
};

export const CharacterItem = ({ item }: { item: CharacterRole }) => {
    const posterUrl = item.character?.poster?.mainUrl || item.character?.poster?.originalUrl

    const name = item.character?.russian || item.character?.name;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.characterContainer}
            onPress={() => handleCharacterPress(item.character.id)}
        >
            <View style={styles.imgShadow}>
                <Poster
                    image={posterUrl}
                    priority='high'
                    imageStyle={styles.characterImage}
                    transitionDuration={300}
                    iconName='questionmark'
                    noImageIconSize={42}
                />
            </View>
            <ThemedText type="subtitle" numberOfLines={1} style={styles.characterName}>
                {name}
            </ThemedText>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
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
    }
});
