import { ReactElement, useState } from 'react';
import { Stack } from 'expo-router';
import { BlurTint, BlurView } from 'expo-blur';
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated';

interface HeaderBlurProps {
    blurValue: SharedValue<number>;
    isDark?: boolean;
    iconColor: string;
    title: string;
    malId?: string | number;
    headerLeft?: ReactElement;
    headerRight?: ReactElement;
    showTitle?: boolean;
    tint?: BlurTint;
}
export const HeaderBlur = ({ blurValue, title, headerLeft, headerRight, showTitle = true, tint = 'systemChromeMaterial' }: HeaderBlurProps) => {
    const [intensity, setIntensity] = useState(0);

    useAnimatedReaction(
        () => blurValue.value,
        (newVal) => {
            runOnJS(setIntensity)(newVal);
        }, []
    );

    return (
        <Stack.Screen
            options={{
                headerBlurEffect: 'none',
                headerBackground: () => (
                    <BlurView style={{ flex: 1 }} intensity={intensity} tint={tint} />
                ),
                ...(title && { headerTitle: showTitle ? title : '' }),
                ...(headerLeft && { headerLeft: () => headerLeft }),
                ...(headerRight && { headerRight: () => headerRight }
                )
            }}
        />
    );
};
