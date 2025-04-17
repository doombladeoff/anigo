import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AnimeList } from "@/components/AnimeList";

import { useAnimeListContext } from "@/context/AnimeListContext";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";

export default function AnimeListScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const { headerText, paramRequest } = useLocalSearchParams();
  const { data } = useAnimeListContext();

  const [animeList, setAnimeList] = useState<ShikimoriAnime[]>(data);
  const [page, setPage] = useState(2);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNextPage = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    try {
      const props: RequestProps = JSON.parse(paramRequest as string);
      const res = await getAnimeList({ ...props, page });

      setAnimeList((prev) => [...prev, ...res]);
      setPage((prev) => prev + 1);
      if (res.length === 0) setHasMore(false);
    } catch (err) {
      console.error("Error load animes:", err);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, page, paramRequest]);

  useEffect(() => {
    navigation.setOptions({ title: headerText as string });
  }, [headerText, navigation]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <AnimeList
        animeList={animeList}
        headerShow={false}
        horizontal={false}
        containerStyle={{
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight,
        }}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.7}
        ListFooterComponent={
          isFetching ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="white" />
              <ThemedText> LOADING </ThemedText>
            </View>
          ) : null
        }
        ListFooterComponentStyle={{ paddingBottom: 20 }}
      />
    </ThemedView>
  );
}
