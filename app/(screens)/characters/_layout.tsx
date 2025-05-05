import { Stack } from "expo-router";
import { useMemo } from "react";

export default  function CharactersLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="[id]" />
            <Stack.Screen name='Characters'/>
        </Stack>
    )
}