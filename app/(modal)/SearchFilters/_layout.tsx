import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { useSearchStore } from "@/store/searchStore";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function FilterLayout() {
    const { handleClearFilters } = useSearchStore();
    const iconColor = useThemeColor({ dark: 'white', light: 'black' }, 'icon')
    return (
        <Stack screenOptions={{
            headerShown: true,
            animationDuration: 300,
            headerTransparent: true,
            headerBlurEffect: 'systemChromeMaterial',
            headerBackTitle: 'Назад',
        }}>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Фильтер',
                    animation: 'fade_from_bottom',
                    headerLeft: () => (
                        <TouchableOpacity activeOpacity={0.8} onPress={handleClearFilters}>
                            <ThemedText style={{ color: '#DB2B69', shadowColor: '#DB2B69', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 3 }}>Сбросить</ThemedText>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.back()}
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        >
                            <MaterialCommunityIcons name='close' size={30} color={iconColor} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen
                name="GenreScreen"
                options={{
                    headerTitle: 'Жанры',
                    headerLeft: ({ label }) => (
                        <TouchableOpacity onPress={router.back} style={{ gap: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <IconSymbol name='chevron.left' size={18} color={iconColor} />
                            <ThemedText>{label}</ThemedText>
                        </TouchableOpacity>
                    )
                }}
            />
        </Stack>
    )
}