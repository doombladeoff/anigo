import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    Easing,
    withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';

const AnimatedStar = Animated.createAnimatedComponent(AntDesign);
const STAR_COUNT = 5;

type Props = {
    rating: number;
    setRating: (value: number) => void;
};

export const RatingStars = ({rating, setRating}: Props) => {
    const animatedValues = Array.from({length: STAR_COUNT}, () => useSharedValue(0));

    const animateStars = (target: number) => {
        animatedValues.forEach((val, i) => {
            const delay = i * 50;
            val.value = withDelay(
                delay,
                withTiming(i < target ? 1 : 0, {
                    duration: 300,
                    easing: Easing.out(Easing.exp),
                })
            );
        });
    };

    const handlePress = (index: number) => {
        const value = Math.max(1, index + 1);
        setRating(value);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        animateStars(value)
    };

    useEffect(() => {
        animateStars(rating)
    }, [rating]);

    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 20, gap: 10}}>
            {animatedValues.map((sharedValue, index) => {
                const animatedStyle = useAnimatedStyle(() => {
                    const color = interpolateColor(
                        sharedValue.value,
                        [0, 1],
                        ['rgba(101,101,101,0.27)', '#ff3b30']
                    );

                    const scale = withTiming(sharedValue.value ? 1.2 : 1, {
                        duration: 200,
                        easing: Easing.out(Easing.exp),
                    });

                    return {
                        color,
                        transform: [{scale}],
                        shadowColor: '#ff3b30', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.65, shadowRadius: 3.85, elevation: 5
                    };
                });

                return (
                    <TouchableOpacity
                        key={index}
                        onPressOut={() => handlePress(index)}
                        activeOpacity={0.8}
                        style={{alignItems: 'center'}}
                    >
                        <AnimatedStar
                            name="star"
                            size={46}
                            style={[{marginBottom: 10}, animatedStyle]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
