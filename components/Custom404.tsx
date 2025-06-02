import { Image } from "expo-image";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View, useWindowDimensions } from "react-native";

interface Custom404Props {
    errorText: string;
    onPress: () => void;
    buttonText?: string;
}

export const Custom404 = ({ errorText, onPress, buttonText = "Try Again" }: Custom404Props) => {
    const { width } = useWindowDimensions();

    return (
        <ThemedView style={styles.container}>
            <Image
                source={require("../assets/images/404.png")}
                style={{ width: width * 1, height: width * 0.75 }}
                contentFit="contain"
                transition={500}
            />

            <View style={styles.content}>
                <ThemedText style={styles.errorText}>{errorText}</ThemedText>

                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={onPress}>
                    <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 64,
        backgroundColor: "transparent",
    },
    content: {
        width: "100%",
        alignItems: "center",
        gap: 30,
    },
    errorText: {
        textAlign: "center",
        fontSize: 21,
        fontWeight: "600",
        color: "#4A4A4A",
        lineHeight: 28,
    },
    button: {
        backgroundColor: '#DB2D69',
        alignSelf: 'stretch',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        shadowColor: '#DB2D69',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        alignItems: 'center',
        elevation: 5,
        minWidth: 280,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#fff",
        letterSpacing: 0.3,
        fontFamily: "Inter-Medium",
    },
});
