import { FlatList, LayoutChangeEvent, View } from "react-native";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useComments } from "@/hooks/useComments";
import { CommentItem } from "./CommentItem";
import { ActionButton } from "./ActionButton";
import { CommentForm } from "./CommentForm";
import styles from "./styles";

type CommentsProps = {
    onLayout?: (e: LayoutChangeEvent) => void;
    onFocus?: () => void;
    animeId: number | string;
};

export const Comments = ({onLayout, onFocus, animeId}: CommentsProps) => {
    const {user} = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const {
        comments,
        text,
        setText,
        titleText,
        setTitleText,
        rating,
        setRating,
        handleSend,
        handleClearData,
        loadingSend,
        handleDelete,
    } = useComments(animeId, user);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <ActionButton label="Оставить отзыв" onPress={() => setModalVisible(true)}/>

            <CommentForm
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    handleClearData();
                }}
                onSubmit={async () => {
                    await handleSend();
                    setModalVisible(false);
                }}
                rating={rating}
                setRating={setRating}
                titleText={titleText}
                setTitleText={setTitleText}
                text={text}
                setText={setText}
                loading={loadingSend}
                onFocus={onFocus}
            />

            <FlatList
                data={comments}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <CommentItem item={item} animeId={String(animeId)} handleDelete={handleDelete}/>
                )}
            />
        </View>
    );
};