import { ImageStyle, StyleProp, TouchableOpacity } from "react-native";
import { CarouselRenderItem } from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import axios from "axios";
import { router } from "expo-router";

interface Options {
  rounded?: boolean;
  style?: StyleProp<ImageStyle>;
}

const getDataFull = async (id: number) => {
  try {
    const response = await axios.get(
      `https://api.yani.tv/anime/${id}?need_videos=false`
    );

    return response.data.response.remote_ids.shikimori_id;
  } catch (e) {
    console.error(e);
  }
};

export const renderItem =
  ({ rounded = false, style }: Options = {}): CarouselRenderItem<any> =>
  ({ item }: { index: number; item: any }) =>
    (
      <TouchableOpacity
        style={{ width: "100%", paddingLeft: 20 }}
        onPress={async () => {
          const id = await getDataFull(item.anime_id);
          router.push({ pathname: "/(screens)/[id]", params: { id: id } });
        }}
        activeOpacity={1}
      >
        <Image
          source={{ uri: `https:${item.poster.fullsize}` }}
          style={[
            style
              ? style
              : {
                  width: 200,
                  height: 300,
                  borderRadius: rounded ? 6 : 0,
                  shadowColor: "#ffffff",
                  shadowOffset: {
                    width: 2,
                    height: 2,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 1.84,
                },
          ]}
        />
      </TouchableOpacity>
    );
