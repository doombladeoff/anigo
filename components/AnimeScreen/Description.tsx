import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
import { cleanedText } from "@/utils/cleanTextTags";

const NUMBER_OF_LINES = 5
export const Description = ({text}: { text: string }) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const lines = useRef<number>(0)

    return (
        <>
            <ThemedText
                numberOfLines={isExpanded ? undefined : NUMBER_OF_LINES}
                onTextLayout={(e) => {
                    console.log(e.nativeEvent.lines.length);
                    lines.current = e.nativeEvent.lines.length
                    console.log('cur',lines.current)
                }}
                type={'default'}
                style={{paddingHorizontal: 10}}
            >
                {cleanedText(text ?? '')}
                {isExpanded &&
                    <ThemedText
                        style={{color: '#e7b932', paddingHorizontal: 10}}
                        onPress={() => setIsExpanded(!isExpanded)}
                    > Show less</ThemedText>
                }
            </ThemedText>
            {!isExpanded &&
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <ThemedText style={{color: '#e7b932', paddingHorizontal: 10}}>Read more</ThemedText>
                </TouchableOpacity>
            }
        </>
    )
}