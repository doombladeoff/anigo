import {
    KeyboardAvoidingView,
    Modal, Platform,
    SafeAreaView,
    ScrollView, useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { RatingStars } from './RatingStars';
import { ModalHeader } from "./ModalHeader";
import { InputBlock } from "./InputBlock";
import { ActionButton } from "./ActionButton";
import styles from "./styles";
import { useRef } from "react";

export const CommentForm = ({
    visible,
    onCancel,
    onSubmit,
    rating,
    setRating,
    titleText,
    setTitleText,
    text,
    setText,
    loading,
    onFocus,
}: {
    visible: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    rating: number;
    setRating: (r: number) => void;
    titleText: string;
    setTitleText: (t: string) => void;
    text: string;
    setText: (t: string) => void;
    loading: boolean;
    onFocus?: () => void;
}) => {
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === "dark";
    const ref = useRef<ScrollView>(null);

    return (
        <Modal visible={visible} animationType="slide" presentationStyle='pageSheet' onRequestClose={onCancel}>
            <SafeAreaView
                style={[styles.modalContainer, {
                    paddingBottom: insets.bottom,
                    backgroundColor: isDark ? "#121212" : "white"
                }]}
            >
                <ModalHeader onCancel={onCancel}/>

                <KeyboardAvoidingView
                    style={{flex: 1, justifyContent: 'flex-start', backgroundColor: isDark ? "#121212" : "white"}}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={60}
                >
                    <ScrollView
                        ref={ref}
                        scrollEnabled={false}
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                        onLayout={(e) => ref.current?.scrollToEnd({animated: true})}
                    >

                        <ThemedText style={styles.sectionTitle}>Рейтинг</ThemedText>
                        <RatingStars rating={rating} setRating={setRating}/>
                        <ThemedText style={styles.ratingValue}>{rating}.0</ThemedText>

                        <InputBlock
                            label="Заголовок"
                            value={titleText}
                            onChangeText={setTitleText}
                            placeholder="Написать заголовок"
                            onFocus={onFocus}
                            editable={!loading}
                            maxLength={50}
                        />
                        <InputBlock
                            label="Ваш отзыв"
                            value={text}
                            onChangeText={setText}
                            placeholder="Написать комментарий"
                            multiline
                            onFocus={onFocus}
                            editable={!loading}
                            maxLength={1000}
                            onContentSizeChange={(e) => {
                                if (e.nativeEvent.contentSize.height) {
                                    ref.current?.scrollToEnd({animated: true});
                                }
                            }}
                        />

                        {!!text.length && (
                            <ThemedText style={styles.characterCount}>
                                {text.length} / 1000
                            </ThemedText>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
                <ActionButton label="Отправить" onPress={onSubmit}/>
            </SafeAreaView>
        </Modal>
    );
};
