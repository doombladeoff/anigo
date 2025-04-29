import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';

export function HelloWave() {
    const rotationAnimation = useSharedValue(0);

    const startAnim = () => {
        return (
            rotationAnimation.value = withRepeat(
                withSequence(withTiming(25, {duration: 150}), withTiming(0, {duration: 150})),
                4
            )
        )
    }

    useEffect(() => {
        startAnim();
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${rotationAnimation.value}deg`}],
    }));

    return (
        <Pressable onPress={startAnim} hitSlop={{left: 12, top: 12, right: 12, bottom: 12}}>
            <Animated.View style={animatedStyle}>
                <ThemedText style={styles.text}>👋</ThemedText>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
    },
});
