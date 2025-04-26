import { router, Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacity } from "react-native";
import { useNavigationState } from "@react-navigation/core";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ScreensLayout() {
    const iconColor = useThemeColor({dark: 'white', light: 'black'}, 'icon');

    const navState = useNavigationState((state) => state);

    const goBackSafe = () => {
        navState?.routes?.length > 1 ? router.back() : router.replace('/')
    };

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: "regular",
                headerTitle: '',
                headerLeft: () => {
                    return (
                        <TouchableOpacity onPress={() => goBackSafe()} activeOpacity={0.8} hitSlop={30}
                                          style={{paddingLeft: 10}}>
                            <FontAwesome6 name="arrow-left" size={26} color={iconColor}/>
                        </TouchableOpacity>
                    );
                }
            }}
        >
            <Stack.Screen name="[id]"/>
            <Stack.Screen name="favorites" options={{headerTitle: "Избранные"}}/>
        </Stack>
    );
}
