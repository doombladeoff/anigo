import { Router, router, Stack, useLocalSearchParams } from "expo-router";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";
import { storage } from "@/utils/storage";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ScreensLayout() {
    const iconColor = useThemeColor({dark: 'white', light: 'black'}, 'icon');
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: "regular",
                headerLeft: () => {
                    return (
                        <HeaderButton onPress={() => router.back()} pressOpacity={0.8}>
                            <FontAwesome6 name="arrow-left" size={23} color={iconColor}/>
                        </HeaderButton>
                    );
                },
            }}
        >
            <Stack.Screen name="[id]"/>
            <Stack.Screen name="favorites" options={{headerTitle: "Избранные"}}/>
        </Stack>
    );
}
