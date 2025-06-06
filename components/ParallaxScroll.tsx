import { useEffect, type PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    AnimatedStyle,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAnimeStore } from '@/store/animeStore';
import { ScrollViewProps } from 'react-native';

type Props = PropsWithChildren<
    ScrollViewProps & {
        headerComponent: ReactElement;
        headerBackgroundColor: { dark: string; light: string };
        headerHeight: number;
        headerAnimatedStyle?: AnimatedStyle<ViewStyle>;

    }
>;

export default function ParallaxScroll({
    children,
    headerComponent,
    headerBackgroundColor,
    headerHeight = 400,
    headerAnimatedStyle,
    ...restProps
}: Props) {
    const colorScheme = useColorScheme() ?? 'light';
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const { setRef } = useAnimeStore();

    const headerImageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollOffset.value,
                    // [-headerHeight, 0, headerHeight],
                    [-headerHeight, 0, 0],

                    // [-headerHeight / 2, 0, headerHeight * 0.35]
                    [-headerHeight, 0, headerHeight * 0.35]

                ),
            },
            {
                scale: interpolate(
                    scrollOffset.value,
                    [-headerHeight, 0, headerHeight],
                    [2, 1, 1]
                    // [0,0,0]
                ),
            },
        ],
    }));


    useEffect(() => {
        if (setRef && scrollRef.current) {
            setRef(scrollRef);
        }
    }, [setRef]);

    return (
        <>
            <ThemedView style={styles.container}>
                <Animated.ScrollView
                    ref={scrollRef}
                    scrollEventThrottle={16}
                    {...restProps}
                >
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                backgroundColor: headerBackgroundColor[colorScheme],
                                height: headerHeight,
                            },
                            headerImageAnimatedStyle
                        ]}
                    >
                        {headerComponent}
                    </Animated.View>

                    <ThemedView style={styles.content}>
                        {children}
                    </ThemedView>
                </Animated.ScrollView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        overflow: 'hidden',
    },
});
