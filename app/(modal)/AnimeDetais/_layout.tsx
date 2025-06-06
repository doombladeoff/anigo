import { Stack } from "expo-router";

export default function AnimeModalsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: true,
                animationDuration: 300,
                headerTransparent: true,
                headerBlurEffect: 'systemChromeMaterial',
            }} />
        </Stack>
    )
}