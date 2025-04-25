import {
    BlurMask,
    Canvas,
    Path,
    SweepGradient,
    Skia,
    vec,
    TileMode, SkEnum,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import { View, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface ActivityIndicatorProps {
    size: number;
    containerStyle?: ViewStyle;
    color?: string;
    strokeWidth?: number;
    useGradient?: boolean;
    gradientColors?: string[];
    strokeCap?: "butt" | "round" | "square";
    gradientMode?: SkEnum<typeof TileMode>;
    opacity?: number;
    useFadeIn?: boolean;
    useFadeOut?: boolean;
    FadeInDuration?: number;
    FadeOutDuration?: number;
}

export const Loader = ({
    size,
    containerStyle,
    color,
    strokeWidth = 6,
    useGradient = false,
    gradientColors = ["cyan", "magenta", "yellow", "cyan"],
    strokeCap = "round",
    gradientMode,
    opacity = 1,
    useFadeIn = false,
    useFadeOut = false,
    FadeInDuration = 500,
    FadeOutDuration = 500,
}: ActivityIndicatorProps) => {
    const isDark = useColorScheme() === "dark";
    const radius = (size - strokeWidth) / 2;
    const canvasSize = size + 30;

    const circle = useMemo(() => {
        const path = Skia.Path.Make();
        path.addCircle(canvasSize / 2, canvasSize / 2, radius);
        return path;
    }, [canvasSize, radius]);

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, {duration: 1000, easing: Easing.linear}),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${Math.PI * 2 * progress.value}rad`}],
    }));

    const startPath = useDerivedValue(() =>
        interpolate(progress.value, [0, 0.5, 1], [0.6, 0.3, 0.6])
    );

    return (
        <View style={[styles.overlay, containerStyle]}>
            <Animated.View
                entering={useFadeIn ? FadeIn.duration(FadeInDuration) : undefined}
                exiting={useFadeOut ? FadeOut.duration(FadeOutDuration) : undefined}
                style={[animatedStyle, styles.indicatorContainer]}
            >
                <Canvas style={{width: canvasSize, height: canvasSize}}>
                    <Path
                        path={circle}
                        color={color ?? (isDark ? "white" : "black")}
                        style="stroke"
                        strokeWidth={strokeWidth}
                        start={startPath}
                        end={1}
                        strokeCap={strokeCap}
                        opacity={opacity}
                    >
                        {useGradient && (
                            <SweepGradient
                                c={vec(canvasSize / 2, canvasSize / 2)}
                                colors={gradientColors}
                                mode={gradientMode}
                            />
                        )}
                        <BlurMask blur={5} style="solid"/>
                    </Path>
                </Canvas>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        zIndex: 10,
        overflow: "hidden",
    },
    indicatorContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});
