import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function AuthLayout() {
    const iconColor = useThemeColor({dark: 'white', light: 'black'}, 'icon');
    return (
        <Stack screenOptions={{
            headerTransparent: true, headerTitle: '', headerLeft: () => {
                return (
                    <TouchableOpacity activeOpacity={0.8} hitSlop={15} onPress={() => router.back()}>
                        <FontAwesome6 name="arrow-left" size={23} color={iconColor}/>
                    </TouchableOpacity>
                )
            }
        }}>
            <Stack.Screen name='index' options={{headerShown: false}}/>
            <Stack.Screen name='login' options={{headerShown: true}}/>
            <Stack.Screen name='register' options={{headerShown: true}}/>
        </Stack>
    )
}