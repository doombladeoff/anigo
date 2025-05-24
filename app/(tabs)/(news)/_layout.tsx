import { Stack } from "expo-router";
import { useMemo } from "react";

export default function NewsLayout({ segment }: { segment: string }) {
    const rootScreen = useMemo(() => {
        switch (segment) {
            case "(news)":
                return (
                    <Stack.Screen
                        name="index"
                        options={{ title: "News", headerShown: false }}
                    />
                );
        }
    }, [segment]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {rootScreen}
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: '',
                    presentation: 'transparentModal',
                    animation: 'fade'
                }}
            />
        </Stack>
    );
}
