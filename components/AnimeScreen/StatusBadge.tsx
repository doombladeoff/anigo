import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { IconSymbol } from "../ui/IconSymbol";
import { ThemedText } from "../ThemedText";
import { userStatus } from "@/constants/Status";

type StatusBadgeProps = {
    animeStatus?: string;
    statusBadgeStyle?: StyleProp<ViewStyle>;
    statusBadgeTextSize?: number;
    isAnons?: boolean;
    noImageIconSize?: number;
    transitionDuration?: number;
    showIcon?: boolean;
    direction?: "up" | "down" | "left" | "right";
    useBackgroundColor?: boolean;
    height?: number;
    width?: number;
    priority?: "high" | "low" | "normal" | null | undefined;
    animated?: boolean;
};

export const StatusBadge = ({
    animeStatus,
    isAnons = false,
    animated = true,
    direction = "right",
    statusBadgeStyle,
    statusBadgeTextSize = 13,
}: StatusBadgeProps) => {
    const opacity = useSharedValue(0);
    const translate = useSharedValue(10);

    const animatedStyle = useAnimatedStyle(() => {
        let transform: any = [];

        switch (direction) {
            case "left":
                transform = [{ translateX: translate.value }];
                break;
            case "right":
                transform = [{ translateX: -translate.value }];
                break;
            case "up":
                transform = [{ translateY: -translate.value }];
                break;
            case "down":
                transform = [{ translateY: translate.value }];
                break;
            default:
                transform = [];
        }

        return {
            opacity: opacity.value,
            transform,
        };
    });

    useEffect(() => {
        if (animeStatus || isAnons) {
            opacity.value = 0;
            translate.value = 20;

            opacity.value = withTiming(1, { duration: 400 });
            translate.value = withTiming(0, { duration: 400 });
        }
    }, [animeStatus, isAnons]);

    const badgeColor = isAnons
        ? "red"
        : userStatus[animeStatus ?? ""]?.color ?? "gray";

    const badgeLabel = isAnons
        ? "Анонс"
        : userStatus[animeStatus ?? ""]?.label;

    const iconName = userStatus[animeStatus ?? ""]?.iconName;

    return (
        <Animated.View
            style={[
                animated ? animatedStyle : undefined,
                statusBadgeStyle,
                {
                    backgroundColor: badgeColor,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.45,
                    shadowRadius: 7,
                },
            ]}
        >
            {!isAnons && iconName && (
                <IconSymbol name={iconName as any} size={14} color="white" />
            )}

            <ThemedText lightColor="white" style={{ fontSize: statusBadgeTextSize }}>
                {badgeLabel}
            </ThemedText>
        </Animated.View>
    );
};
