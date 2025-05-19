import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, FlatList } from "react-native";
import { CharacterRole } from "@/interfaces/Shikimori.interfaces";
import { Image } from "expo-image";
import { useHeaderHeight } from "@react-navigation/elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconSymbol } from "@/components/ui/IconSymbol";

const { width } = Dimensions.get('window');
const iWidth = (width - 10 * 4) / 3;
const iHeight = iWidth * 1.6;

export default function Characters() {
    const { ch } = useLocalSearchParams();
    const characters = JSON.parse(ch as string);

    const headerHeight = useHeaderHeight();

    const _renderItem = ({ item }: { item: CharacterRole }) => {
        const posterUrl = item.character?.poster?.mainUrl || item.character?.poster?.originalUrl
        return (
            <TouchableOpacity
                onPress={() => {
                    router.push({ pathname: '/characters/[id]', params: { id: item.character.id } });
                }}
                activeOpacity={0.8}
                style={{
                    maxWidth: iWidth,
                    margin: 5,
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.65,
                    shadowRadius: 3.84,
                    elevation: 5,
                    gap: 5,
                }}>
                <Image
                    source={{ uri: posterUrl }}
                    priority='high'
                    transition={300}
                    contentFit='cover'
                    style={{ width: iWidth, height: iHeight, borderRadius: 8, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}
                >
                    {!posterUrl && <IconSymbol name='questionmark' size={62} color={'white'} />}
                </Image>
                <ThemedText numberOfLines={2} type='subtitle' style={{ fontSize: 16 }}>{item.character.russian || item.character.name}</ThemedText>
            </TouchableOpacity>
        )
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <FlatList
                data={characters as CharacterRole[]}
                renderItem={_renderItem}
                numColumns={3}
                contentContainerStyle={{
                    marginHorizontal: 5,
                    paddingTop: headerHeight + 20,
                    paddingBottom: headerHeight / 2
                }}
            />
        </ThemedView>
    );
}