import {View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";
import styles from "./styles";

export const ModalHeader = ({onCancel}: { onCancel: () => void }) => (
    <View style={styles.modalHeader}>
        <TouchableOpacity style={styles.modalCancelArea} onPressOut={onCancel} activeOpacity={0.8}>
            <ThemedText style={styles.cancelText} darkColor="red" lightColor="red">
                Отменить
            </ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.modalTitle}>Написать отзыв</ThemedText>
    </View>
);
