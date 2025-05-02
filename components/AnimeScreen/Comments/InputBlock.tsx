import { StyleProp, TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import styles from "./styles";
import { useColorScheme } from "react-native";
import { ComponentProps, RefObject } from "react";

export const InputBlock = ({
    label,
    ref,
    style,
    ...props
}: {
    label: string;
    style?: StyleProp<TextInput>;
    ref?:RefObject<TextInput>;
} & ComponentProps<typeof TextInput>) => {
    const isDark = useColorScheme() === "dark";

    return (
        <>
            <ThemedText style={styles.sectionTitle}>{label}</ThemedText>
            <TextInput
                ref={ref}
                {...props}
                style={[ style ? style : styles.input,
                    {
                        color: isDark ? "white" : "black",
                        backgroundColor: isDark ? "rgba(42,42,42,0.7)" : "rgba(101,101,101,0.27)",
                    },
                ]}
                placeholderTextColor="gray"
                cursorColor={isDark ? "white" : "black"}
            />
        </>
    );
};
