import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApolloProvider } from "@apollo/client";
import client from "@/api/shikimori/client";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SearchProvider } from "@/context/SearchContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <AuthProvider>
            <SearchProvider>
            <FavoritesProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <ApolloProvider client={client}>
                        <Stack screenOptions={{headerShown: false}}>
                            <Stack.Screen name="(auth)" options={{animation: 'fade_from_bottom', animationDuration: 300}}/>
                            <Stack.Screen name="(tabs)"/>
                            <Stack.Screen name="(screens)"/>
                            <Stack.Screen name="+not-found"/>
                        </Stack>
                        <StatusBar style="auto"/>
                    </ApolloProvider>
                </ThemeProvider>
            </FavoritesProvider>
            </SearchProvider>
        </AuthProvider>
    );
}