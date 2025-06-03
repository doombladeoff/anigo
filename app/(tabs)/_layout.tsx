import React from "react";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AnimeListProvider } from "@/context/AnimeListContext";
import { Image } from "expo-image";
import { storage } from "@/utils/storage";
import { CustomUser, useAuth } from "@/context/AuthContext";

type UserImageProps = {
    user: CustomUser;
    size: number;
    focused: boolean;
};

const UserImage = ({ user, size, focused }: UserImageProps) => {
    const imageStyle = React.useMemo(() => ({
        width: focused ? size : size + 5,
        height: focused ? size : size + 5,
        margin: 2,
        borderRadius: 25,
    }), [size, focused]);

    return (
        <Image
            source={{ uri: user.avatarURL }}
            style={imageStyle}
            autoplay={false}
        />
    );
};

const ProfileIcon = React.memo(({ user, focused, size, color, isSkip }: { user?: CustomUser; focused: boolean; size: number; color: string; isSkip: boolean }) => {
    if (isSkip) {
        return <IconSymbol size={32} name="person.badge.key.fill" color={color} />;
    }

    if (user?.avatarURL || user?.photoURL) {
        return (
            <View
                style={{
                    borderWidth: 2.5,
                    borderRadius: 25,
                    borderColor: focused ? "#e7b932" : "transparent",
                }}
            >
                <UserImage user={user} size={size} focused={focused} />
            </View>
        );
    }

    return <IconSymbol size={focused ? 20 : 28} name="person.fill" color={color} style={{ margin: 4 }} />;
});

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { user } = useAuth();
    const isSkip = storage.getSkip();

    return (
        <AnimeListProvider>
            <Tabs
                screenOptions={{
                    animation: "fade",
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
                        tabBarIcon: ({ color }) => <IconSymbol size={32} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="(news)"
                    options={{
                        title: "",
                        headerShown: false,
                        tabBarIcon: ({ color }) => <IconSymbol size={32} name="newspaper" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        title: "",
                        tabBarIcon: ({ color }) => <IconSymbol size={32} name="magnifyingglass" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="schedule"
                    options={{
                        title: "Schedule",
                        tabBarIcon: ({ color }) => <IconSymbol size={32} name="calendar" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Профиль",
                        headerShown: true,
                        headerTransparent: true,
                        tabBarIcon: ({ color, size, focused }) => (
                            <ProfileIcon user={user ?? undefined} focused={focused} size={size} color={color} isSkip={isSkip ?? false} />
                        ),
                    }}
                />
            </Tabs>
        </AnimeListProvider>
    );
}