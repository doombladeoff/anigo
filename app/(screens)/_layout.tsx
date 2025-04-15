import { router, Stack } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

export default function ScreensLayout() {
    return (
    <Stack screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: 'regular',
        headerLeft: () => <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
            router.back()
        }}
        >
            <FontAwesome6 name="arrow-left" size={23} color="white"/>
        </TouchableOpacity>,
        headerRight: () => <TouchableOpacity>
            <AntDesign name='staro' size={23} color="white"/>
        </TouchableOpacity>,
    }}>
        <Stack.Screen name="[id]"/>
    </Stack>
    )
}