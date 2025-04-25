import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApolloProvider } from "@apollo/client";
import client from "@/api/shikimori/client";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <ApolloProvider client={client}>
                    <Stack screenOptions={{headerShown: false}}>
                        <Stack.Screen name="(auth)" options={{animation: 'fade_from_bottom'}}/>
                        <Stack.Screen name="(tabs)" options={{animation: 'fade'}}/>
                        <Stack.Screen name="(screens)"/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                    <StatusBar style="auto"/>
                </ApolloProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
