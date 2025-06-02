import * as DropdownMenu from "zeego/dropdown-menu";
import { animeStatuses } from "@/constants/Status";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { StyleProp, ViewStyle } from "react-native";

type BookMarkProps = {
    disabled: boolean;
    inFavorite: boolean;
    onRemove: () => void;
    onAdd: (key?: string) => void;
    animatedStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
    isAnons: boolean;
}

export const Bookmark = ({ disabled, inFavorite, onRemove, onAdd, animatedStyle, isAnons }: BookMarkProps) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger disabled={disabled}>
                <Animated.View
                    style={animatedStyle}
                    hitSlop={{
                        left: 20,
                        top: 20,
                        right: 20,
                        bottom: 20
                    }}>
                    <FontAwesome
                        name={inFavorite ? "bookmark" : "bookmark-o"}
                        size={32}
                        color="#e7b932"
                    />
                </Animated.View>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                {Object.entries(
                    isAnons
                        ? { planned: animeStatuses.planned }
                        : animeStatuses
                ).map(([key, { label, iconName, color }]) => (
                    <DropdownMenu.Item key={key} onSelect={() => onAdd(key)}>
                        <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                        <DropdownMenu.ItemIcon
                            ios={{
                                name: iconName as any,
                                hierarchicalColor: { dark: color, light: color },
                            }}
                        />
                    </DropdownMenu.Item>
                ))}

                {inFavorite ? (
                    <DropdownMenu.Item key='removeFromFavorite' onSelect={onRemove}>
                        <DropdownMenu.ItemTitle>Убрать из израбнного</DropdownMenu.ItemTitle>
                        <DropdownMenu.ItemIcon
                            ios={{
                                name: 'heart.slash.fill',
                                hierarchicalColor: { dark: 'red', light: 'red' },
                            }}
                        />
                    </DropdownMenu.Item>
                ) : (
                    <DropdownMenu.Item key='addToFavorite' onSelect={onAdd} >
                        <DropdownMenu.ItemTitle>Добавить в избранное</DropdownMenu.ItemTitle>
                        <DropdownMenu.ItemIcon
                            ios={{
                                name: 'heart.fill',
                                hierarchicalColor: { dark: 'red', light: 'red' },
                            }}
                        />
                    </DropdownMenu.Item>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}