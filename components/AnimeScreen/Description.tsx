import { ThemedText } from "@/components/ThemedText";
import { useRef, useState } from "react";
import { cleanedText } from "@/utils/cleanTextTags";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

interface DescriptionProps {
    text: string;
    containerStyle?: ViewStyle;
    numberOfLines?: number
    textStyle?: StyleProp<TextStyle>;
    showExpanded?: boolean;
}
export const Description = ({ text, containerStyle, numberOfLines = 5, textStyle, showExpanded = true }: DescriptionProps) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const lines = useRef<number>(0)

    if (!text || text.length === 0) return;

    return (
        <View style={containerStyle}>
            <ThemedText
                numberOfLines={isExpanded ? undefined : numberOfLines}
                onTextLayout={(e) => {
                    lines.current = e.nativeEvent.lines.length
                }}
                style={textStyle ? textStyle : undefined}
            >
                {cleanedText(text ?? '')}
                {isExpanded &&
                    <ThemedText
                        style={textStyle ? textStyle : { color: '#e7b932', paddingHorizontal: 10 }}
                        onPress={() => setIsExpanded(!isExpanded)}
                    > Скрыть</ThemedText>
                }
            </ThemedText>
            {!isExpanded && showExpanded &&
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <ThemedText style={textStyle ? textStyle : { color: '#e7b932' }}>Больше</ThemedText>
                </TouchableOpacity>
            }
        </View>
    )
}