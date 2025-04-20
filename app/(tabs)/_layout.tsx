import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AnimeListProvider } from "@/context/AnimeListContext";
import { SearchHeader } from "@/components/ui/SearchHeader";
import { SearchProvider } from "@/context/SearchContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AnimeListProvider>
      <SearchProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarShowLabel: false,
            tabBarIconStyle: { top: 10 },
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                position: "absolute",
              },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="(home)"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={32} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: "",
              headerShown: true,
              headerTransparent: true,
              header: () => {
                return <SearchHeader />;
              },
              tabBarIcon: ({ color }) => (
                <IconSymbol size={32} name="magnifyingglass" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="schedule"
            options={{
              title: "Schedule",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={32} name="calendar" color={color} />
              ),
            }}
          />
        </Tabs>
      </SearchProvider>
    </AnimeListProvider>
  );
}
