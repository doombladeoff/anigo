import { router, Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigationState } from "@react-navigation/core";
import { useAuth } from "@/context/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function ScreensLayout() {
    const { user } = useAuth();
    const iconColor = useThemeColor({ dark: 'white', light: 'black' }, 'icon');

    const navState = useNavigationState((state) => state);
    const goBackSafe = () => {
        navState?.routes?.length > 1 ? router.back() : router.replace('/');
    };

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: 'regular',
                headerTitle: '',
                headerLeft: () => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                goBackSafe();
                            }} hitSlop={{ top: 30, right: 30, bottom: 30, left: 30 }}
                            style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5, alignItems: 'center' }}
                        >
                            <IconSymbol name='chevron.left' size={22} color={iconColor} />
                        </TouchableOpacity>
                    );
                }
            }}
        >

            <Stack.Screen name="[id]" />
            <Stack.Screen name="animeListByGenre" />
            {user ? <Stack.Screen name="favorites" options={{ headerTitle: "Избранные" }} /> : null}
            <Stack.Screen
                name="characters"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}
