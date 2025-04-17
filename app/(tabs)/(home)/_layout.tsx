import { Stack } from "expo-router";
import { useMemo } from "react";

export default function HomeLayout({ segment }: { segment: string }) {
  const rootScreen = useMemo(() => {
    switch (segment) {
      case "(home)":
        return (
          <Stack.Screen
            name="index"
            options={{ title: "Home", headerShown: false }}
          />
        );
    }
  }, [segment]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {rootScreen}
      <Stack.Screen
        name="pages"
        options={({ route }: { route: any }) => ({
          title: route.params?.headerText,
          headerBackTitle: "Back",
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
        })}
      />
    </Stack>
  );
}
