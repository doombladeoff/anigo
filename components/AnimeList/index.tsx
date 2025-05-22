import {
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
  FlatListProps,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useAnimeListContext } from "@/context/AnimeListContext";
import { ThemedText } from "@/components/ThemedText";

import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import Skeleton from "@/components/ui/Skeleton";

interface AnimeListProps extends Partial<FlatListProps<ShikimoriAnime>> {
  headerText?: string;
  headerTextStyle?: TextStyle;
  headerShow?: boolean;
  containerStyle?: ViewStyle;
  headerContentStyle?: ViewStyle;
  showType?: "Top" | "OnScreens";
  animeList?: ShikimoriAnime[];
  isLoading?: boolean;
  horizontal?: boolean;
  queryProps?: RequestProps;
  showLimit?: number;
}

const screenWidth = Dimensions.get("window").width;
const GAP = 10;

const getImageSize = (columns: number) => {
  const totalGaps = GAP * (columns + 1);
  const width = (screenWidth - totalGaps) / columns;
  return { width, height: width * 1.44 };
};

const horizontalSize = getImageSize(2.7);
const verticalSize = getImageSize(3);

export const AnimeList = ({
  headerText = "Header",
  headerTextStyle,
  headerShow = true,
  containerStyle,
  headerContentStyle,
  showType = "Top",
  animeList: animeListData,
  isLoading = false,
  horizontal = false,
  queryProps,
  showLimit,
  ...rest
}: AnimeListProps) => {
  const iconColor = useThemeColor({ dark: "white", light: "dark" }, "icon");
  const { setAnimeListContext } = useAnimeListContext();

  const size = horizontal ? horizontalSize : verticalSize;

  const renderItem = ({ item }: { item: ShikimoriAnime }) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/(screens)/[id]", params: { id: item.malId } })
      }
    >
      <Image
        source={{ uri: item.poster.main2xUrl }}
        style={{ width: size.width, height: size.height, borderRadius: 12 }}
        transition={400}
        cachePolicy="disk"
        priority="high"
      />
    </Pressable>
  );

  if (isLoading) {
    return (
        <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
          <View style={{ flexDirection:'row', justifyContent: 'space-between'}}>
            <Skeleton width={150} height={20} style={{ backgroundColor: 'gray', borderRadius: 4, marginBottom: 10 }} />
            <Skeleton width={25} height={20} style={{ backgroundColor: 'gray', borderRadius: 4, marginBottom: 10 }} />
          </View>
          <View style={{ flexDirection: "row", gap: GAP}}>
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} width={size.width} height={size.height} style={{backgroundColor: 'gray'}}/>
            ))}
          </View>
        </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {headerShow && (
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            },
            headerContentStyle,
          ]}
        >
          <ThemedText type="title" style={headerTextStyle}>
            {headerText}
          </ThemedText>
          <TouchableOpacity
            onPress={() => {
              setAnimeListContext(animeListData || []);
              router.push({
                pathname: "/(tabs)/(home)/pages/animelist",
                params: {
                  headerText,
                  paramRequest: JSON.stringify(queryProps),
                },
              });
            }}
          >
            <FontAwesome6 name="chevron-right" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={animeListData?.slice(0, showLimit)}
        renderItem={renderItem}
        keyExtractor={(item) => item.malId.toString()}
        contentContainerStyle={containerStyle}
        showsHorizontalScrollIndicator={false}
        horizontal={horizontal}
        numColumns={!horizontal ? 3 : undefined}
        columnWrapperStyle={
          !horizontal
            ? { gap: GAP, paddingHorizontal: 10, paddingVertical: 5 }
            : undefined
        }
        {...rest}
      />
    </View>
  );
};
