import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AnimeListProvider } from "@/context/AnimeListContext";
import { SearchHeader } from "@/components/ui/SearchHeader";
import { SearchProvider } from "@/context/SearchContext";
import { Image } from "expo-image";
import { storage } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const {user} = useAuth()
    const isSkip = storage.getSkip();

    return (
        <AnimeListProvider>
            <SearchProvider>
                <Tabs
                    screenOptions={{
                        animation: 'fade',
                        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                        headerShown: false,
                        tabBarButton: HapticTab,
                        tabBarShowLabel: false,
                        tabBarIconStyle: {top: 10},
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
                            tabBarIcon: ({color}) => (
                                <IconSymbol size={32} name="house.fill" color={color}/>
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
                                return <SearchHeader/>;
                            },
                            tabBarIcon: ({color}) => (
                                <IconSymbol size={32} name="magnifyingglass" color={color}/>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="schedule"
                        options={{
                            title: "Schedule",
                            tabBarIcon: ({color}) => (
                                <IconSymbol size={32} name="calendar" color={color}/>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: "Profile",
                            headerShown: true,
                            tabBarIcon: ({color, size, focused}) => {
                                return (
                                    <>
                                        {!isSkip ? (
                                            <View style={{
                                                borderWidth: 2.5,
                                                borderRadius: 25,
                                                borderColor: focused ? '#e7b932' : 'transparent',
                                            }}>
                                                {user?.avatarURL ? (
                                                    <Image
                                                        source={user && {uri: user.avatarURL}}
                                                        style={{
                                                            width: focused ? size : size + 5,
                                                            height: focused ? size : size + 5,
                                                            margin: 2,
                                                            borderRadius: 25
                                                        }}
                                                    />
                                                ) : user?.photoURL ? (
                                                    <Image
                                                        source={user && {uri: user?.photoURL}}
                                                        style={{
                                                            width: focused ? size : size + 5,
                                                            height: focused ? size : size + 5,
                                                            margin: 2,
                                                            borderRadius: 25
                                                        }}
                                                    />
                                                ) : (
                                                    <IconSymbol size={focused ? 20 : 28} name={'person.fill'} color={color}
                                                                style={{margin: 4}}/>
                                                )}
                                            </View>
                                        ) : (
                                            <IconSymbol size={32} name={'person.badge.key.fill'} color={color}/>
                                        )}
                                    </>
                                )
                            }
                        }}
                    />
                </Tabs>
            </SearchProvider>
        </AnimeListProvider>
    );
}
