import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";

export const ActionButton = ({label, onPress}: { label: string; onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.buttonWrapper}
        hitSlop={{top: 30, right: 30, bottom: 30, left: 30}}
        activeOpacity={0.8}
    >
        <LinearGradient
            colors={['#DB2D69', '#DB372D']}
            style={styles.button}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            locations={[1, 0.65]}
        >
            <ThemedText type="subtitle" style={styles.buttonText} lightColor="white">
                {label}
            </ThemedText>
        </LinearGradient>
    </TouchableOpacity>
);
