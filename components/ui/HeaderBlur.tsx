import { memo, useState } from 'react';
import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { ShareButton } from './ShareButton';
import { View } from 'react-native';

interface HeaderBlurProps {
    blurValue: SharedValue<number>;
    isDark: boolean;
    iconColor: string;
    title: string;
    malId: string | number;
    headerLeft?: JSX.Element;
    headerRight?: JSX.Element
}
export const HeaderBlur = ({ blurValue, isDark, iconColor, title, malId, headerLeft, headerRight }: HeaderBlurProps) => {
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
                    <BlurView style={{ flex: 1 }} intensity={intensity} tint={isDark ? 'dark' : 'light'} />
                ),
                ...(headerLeft && { headerLeft: () => headerLeft }),
                ...(headerRight
                    ? { headerRight: () => headerRight }
                    : {
                        headerRight: () => (
                            <View style={{
                                shadowColor: 'black',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 1,
                                shadowRadius: 3
                            }}>
                                <ShareButton text={title} id={malId} iconColor={iconColor} />
                            </View>
                        )
                    }
                )
            }}
        />
    );
};
