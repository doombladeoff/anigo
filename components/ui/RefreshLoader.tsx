import { MutableRefObject, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    withTiming,
} from 'react-native-reanimated';
import { Loader } from "@/components/ui/Loader";

const PULL_DISTANCE = 150;

type AnimatedRefreshLoaderProps = {
    refreshing: boolean;
    scrollHandlerRef: MutableRefObject<ReturnType<typeof useAnimatedScrollHandler> | null>;
};

export default function AnimatedRefreshLoader({refreshing, scrollHandlerRef}: AnimatedRefreshLoaderProps) {
    const insets = useSafeAreaInsets();
    const pullDistance = useSharedValue(0);
    const loaderOpacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: loaderOpacity.value,
    }));

    useEffect(() => {
        if (!refreshing) {
            loaderOpacity.value = withTiming(0, {duration: 0});
        }
    }, [refreshing]);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (refreshing) return;
            const offsetY = event.contentOffset.y;
            if (offsetY < 0) {
                pullDistance.value = Math.min(Math.abs(offsetY), PULL_DISTANCE);
                loaderOpacity.value = pullDistance.value / PULL_DISTANCE;
            }
        },
    });

    useEffect(() => {
        scrollHandlerRef.current = scrollHandler;
    }, []);

    return (
        <Animated.View style={[
            {
                alignItems: 'center',
                position: 'absolute',
                top: insets.top + 40,
                left: 0,
                right: 0,
            },
            animatedStyle,
        ]}>
            <Loader size={32}/>
        </Animated.View>
    );
}
