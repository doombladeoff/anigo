import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function ListLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: "regular",
        headerBackTitle: "Back",
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText>Back</ThemedText>
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name="animelist" />
    </Stack>
  );
}
