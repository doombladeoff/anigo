import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import Carousel, {
  type ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { renderItem } from "@/components/Recommendations/render-item";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { useSharedValue } from "react-native-reanimated";
import { YummyAPI } from "@/api/Yummy";

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const isFetched = useRef<boolean>(false);

  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const ref = React.useRef<ICarouselInstance>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (isFetched.current) return;

      const getRecommendations = await YummyAPI.getRecommendations();
      setRecommendations(getRecommendations);
    };

    fetchRecommendations().then(() => (isFetched.current = true));
  }, []);

  if (recommendations.length === 0) {
    return (
      <BlurView
        style={[styles.container, { alignSelf: "center" }]}
        intensity={80}
        tint="dark"
      >
        <ActivityIndicator size="large" color="white" />
      </BlurView>
    );
  }

  return (
    <BlurView style={styles.container} intensity={80} tint="dark">
      <Image
        source={{ uri: `https:${recommendations[currentIndex]?.poster.big}` }}
        style={styles.backgroundImg}
        transition={100}
      />
      <View
        id="carousel-component"
        data-kind={{ kind: "basic-layouts", name: "stack" }}
        style={{ zIndex: 1, padding: 10 }}
      >
        <Carousel
          ref={ref}
          vertical={false}
          autoPlayInterval={5000}
          autoPlay={true}
          data={recommendations}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          height={300}
          width={Dimensions.get("window").width}
          mode={"horizontal-stack"}
          modeConfig={{
            snapDirection: "left",
            stackInterval: 62,
            rotateZDeg: 0,
          }}
          containerStyle={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            flex: 1,
          }}
          onProgressChange={progress}
          customConfig={() => ({ viewCount: 10, type: "positive" })}
          renderItem={renderItem({ rounded: true })}
          onSnapToItem={(index) => setCurrentIndex(index)}
        />

        <View style={{ paddingTop: 10, paddingRight: 10 }}>
          <ThemedText type="defaultSemiBold">
            {recommendations[currentIndex]?.year}
          </ThemedText>
          <View style={styles.carouselBottomContainer}>
            <ThemedText
              type="title"
              style={{ fontSize: 18, maxWidth: 300 }}
              numberOfLines={1}
            >
              {recommendations[currentIndex]?.title}
            </ThemedText>
            <Pagination.Basic<{ color: string }>
              progress={progress}
              data={recommendations.map((color) => ({ color }))}
              size={10}
              dotStyle={styles.carouselDot}
              activeDotStyle={styles.carouselDotActive}
              containerStyle={{ gap: 5 }}
              onPress={onPressPagination}
              horizontal
            />
          </View>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 0,
    margin: 10,
  },
  cardContainer: {
    position: "absolute",
    width: 360,
    height: 260,
    padding: 16,
  },
  backgroundImg: {
    width: "100%",
    height: 340,
    position: "absolute",
    zIndex: -2,
    resizeMode: "stretch",
    opacity: 0.5,
  },
  carouselBottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carouselDot: {
    borderRadius: 100,
    backgroundColor: "#262626",
  },
  carouselDotActive: {
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#f1f1f1",
  },
});
