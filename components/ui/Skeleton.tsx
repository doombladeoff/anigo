import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
    width?: ViewStyle["width"];
    height?: ViewStyle["height"];
    borderRadius?: number;
    style?: ViewStyle;
}

const Skeleton: React.FC<SkeletonProps> = ({
    width = "100%",
    height = 20,
    borderRadius = 8,
    style,
}) => {
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(withTiming(1, {duration: 800}), -1, true);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {backgroundColor: "gray"},
                {width, height, borderRadius},
                animatedStyle,
                style,
            ]}
        />
    );
};

export default Skeleton;
