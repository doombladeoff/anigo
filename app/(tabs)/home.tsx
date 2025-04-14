import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimeList } from "@/components/AnimeList";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
    <ThemedView style={{flex: 1, paddingTop: insets.top}}>
        <AnimeList
        containerStyle={{paddingHorizontal: 10, gap: 10}}
        headerText="Top Rated"
        headerContentStyle={{paddingHorizontal: 10}}
        />
    </ThemedView>
    );
}