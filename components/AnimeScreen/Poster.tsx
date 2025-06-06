import { userStatus } from "@/constants/Status"
import { Image, ImageContentFit } from "expo-image"
import { View } from "react-native"
import { IconSymbol } from '../ui/IconSymbol'
import { ThemedText } from "../ThemedText"
import { StyleProp, ViewStyle, ImageStyle } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useEffect, useRef } from "react"
import { SFSymbols6_0 } from "sf-symbols-typescript"
import { StatusBadge } from "./StatusBadge"

type PosterProps = {
    image: string
    image2?: string
    animeStatus?: string
    containerStyle?: StyleProp<ViewStyle>
    imageStyle?: StyleProp<ImageStyle>
    statusBadgeStyle?: StyleProp<ViewStyle>
    statusBadgeTextSize?: number
    isAnons?: boolean
    noImageIconSize?: number
    iconName?: SFSymbols6_0
    transitionDuration?: number
    showIcon?: boolean
    contentFit?: ImageContentFit,
    direction?: 'up' | 'down' | 'left' | 'right',
    useBackgroundColor?: boolean
    height?: number
    width?: number
    priority?: "high" | "low" | "normal" | null | undefined
    animated?: boolean
}

export const Poster = ({
    image,
    image2,
    animeStatus: status = '',
    containerStyle,
    imageStyle,
    statusBadgeStyle,
    statusBadgeTextSize = 14,
    isAnons,
    noImageIconSize = 40,
    iconName = 'photo.fill',
    transitionDuration = 400,
    showIcon = true,
    contentFit = 'cover',
    direction = 'left',
    useBackgroundColor = true,
    height,
    width,
    priority = 'high',
    animated = true
}: PosterProps) => {
    const err = useRef(false);
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(10);

    const animatedStyle = useAnimatedStyle(() => {
        let transform:
            | { translateX: number }[]
            | { translateY: number }[] = [];
        switch (direction) {
            case 'left':
                transform = [{ translateX: translateX.value }];
                break;
            case 'right':
                transform = [{ translateX: -translateX.value }];
                break;
            case 'up':
                transform = [{ translateY: -translateX.value }];
                break;
            case 'down':
                transform = [{ translateY: translateX.value }];
                break;
        };
        return {
            opacity: opacity.value,
            transform,
        };
    });
    useEffect(() => {
        if (status || isAnons) {
            opacity.value = 0;
            translateX.value = 20;

            opacity.value = withTiming(1, { duration: 400 });
            translateX.value = withTiming(0, { duration: 400 });
        }
    }, [status, isAnons]);

    return (
        <View style={containerStyle}>
            <Image
                source={{ uri: err.current ? image2 : image }}
                style={[
                    imageStyle,
                    {
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        backgroundColor: useBackgroundColor ? 'gray' : undefined,
                        ...(height && !((Array.isArray(imageStyle) ? imageStyle : [imageStyle]).some(s => (s && typeof s === 'object' && 'height' in s))) ? { height } : {}),
                        ...(width && !((Array.isArray(imageStyle) ? imageStyle : [imageStyle]).some(s => (s && typeof s === 'object' && 'width' in s))) ? { width } : {}),
                    }
                ]}
                cachePolicy="disk"
                priority={priority}
                transition={transitionDuration}
                contentFit={contentFit}
                onError={() => { err.current = true }}
            >
                {showIcon && <IconSymbol name={iconName} size={noImageIconSize} color='white' />}
            </Image>

            {(status && status !== '' || isAnons) && (
                <StatusBadge
                    animated={animated}
                    isAnons={isAnons}
                    animeStatus={status}
                    statusBadgeStyle={[
                        animated ? animatedStyle : undefined,
                        statusBadgeStyle,
                        {
                            backgroundColor: isAnons ? 'red' : userStatus[status]?.color,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            shadowColor: 'black',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.45,
                            shadowRadius: 7,
                        },
                    ]}
                    statusBadgeTextSize={statusBadgeTextSize}
                />
            )}
        </View>
    );
};
