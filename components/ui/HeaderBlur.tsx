import { ReactElement, useState } from 'react';
import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
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
}
export const HeaderBlur = ({ blurValue, title, headerLeft, headerRight, showTitle = true }: HeaderBlurProps) => {
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
                    <BlurView style={{ flex: 1 }} intensity={intensity} tint={'systemChromeMaterial'} />
                ),
                ...(title && { headerTitle: showTitle ? title : '' }),
                ...(headerLeft && { headerLeft: () => headerLeft }),
                ...(headerRight && { headerRight: () => headerRight }
                )
            }}
        />
    );
};
