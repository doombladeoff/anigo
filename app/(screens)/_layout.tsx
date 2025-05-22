import { router, Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigationState } from "@react-navigation/core";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useSearchContext } from "@/context/SearchContext";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";

export default function ScreensLayout() {
    const {user} = useAuth();
    const {setSearchResults} = useSearchContext();
    const iconColor = useThemeColor({dark: 'white', light: 'black'}, 'icon');

    const navState = useNavigationState((state) => state);
    const goBackSafe = () => {
        navState?.routes?.length > 1 ? router.back() : router.replace('/');
    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: "regular",
                headerTitle: '',
                headerLeft: () => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                goBackSafe();
                                // setSearchResults([]);
                            }} hitSlop={{top: 30, right: 30, bottom: 30, left: 30}}
                        >
                            <FontAwesome6 name="arrow-left" size={28} color={iconColor}/>
                        </TouchableOpacity>
                    );
                }
            }}
        >

            <Stack.Screen name="[id]"/>
            <Stack.Screen name="animeListByGenre"/>
            {user ? <Stack.Screen name="favorites" options={{headerTitle: "Избранные"}}/> : null}
            <Stack.Screen
                name="characters"
                options={({ route }: { route: any }) => ({
                    headerTitle: route.params?.headerText || 'Персонажи',
                    headerBackTitle: "Back",
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: "regular",
                })}
            />
        </Stack>
        </GestureHandlerRootView>
    );
}
