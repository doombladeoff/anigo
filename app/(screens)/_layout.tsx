import { router, Stack } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: "regular",
        headerLeft: () => {
          return (
            <HeaderButton onPress={() => router.back()} pressOpacity={0.8}>
              <FontAwesome6 name="arrow-left" size={23} color="white" />
            </HeaderButton>
          );
        },
        headerRight: () => {
          return (
            <HeaderButton pressOpacity={0.8}>
              <AntDesign name="staro" size={23} color="white" />
            </HeaderButton>
          );
        },
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
