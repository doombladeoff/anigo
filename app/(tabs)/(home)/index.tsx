import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimeList } from "@/components/AnimeList";
import { HelloWave } from "@/components/HelloWave";
import { ScrollView, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAnimeList } from "@/hooks/useAnimeList";
import { onScreenProps, topProps } from "@/constants/QLRequestProps";
import { Recomendations } from "@/components/Recomendations";

const listStyles = {
  containerStyle: { paddingHorizontal: 10, gap: 10 },
  headerTextStyle: { fontSize: 22 },
  headerContentStyle: { paddingHorizontal: 10 },
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { animeList } = useAnimeList();

  return (
    <ThemedView style={{ flex: 1, paddingTop: insets.top, gap: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 10,
        }}
      >
        <ThemedText type="title">AniGO</ThemedText>
        <HelloWave />
      </View>
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        <AnimeList
          headerText="Top Rated"
          showType="Top"
          animeList={animeList.topRated}
          horizontal={true}
          queryProps={topProps}
          showLimit={5}
          isLoading={animeList.topRated.length === 0}
          {...listStyles}
        />
        <AnimeList
          headerText="On Screens"
          showType="OnScreens"
          animeList={animeList.onScreen}
          horizontal={true}
          queryProps={onScreenProps}
          showLimit={5}
          isLoading={animeList.onScreen.length === 0}
          {...listStyles}
        />
      </ScrollView>
    </ThemedView>
  );
}
