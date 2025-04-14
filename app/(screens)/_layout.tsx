import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pressable } from "react-native";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

export default function ScreensLayout() {
    return (
    <Stack screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: 'regular',
        headerLeft: () => <Pressable
        onPress={() => {
            router.back()
        }}
        >
            <FontAwesome6 name="arrow-left" size={20} color="white"/>
        </Pressable>,
        headerRight: () => <Pressable>
            <AntDesign name='staro' size={20} color="white"/>
        </Pressable>,
    }}>
        <Stack.Screen name="[id]"/>
    </Stack>
    )
}