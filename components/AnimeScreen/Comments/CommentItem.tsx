import { View, StyleSheet, TouchableOpacity, Text, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { checkIfUserLiked, getLikesCount, toggleLikeComment } from "@/utils/firebase/comments";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { memo, RefObject, useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type CommentItemProps = {
    item: {
        id: string;
        text: string;
        titleText: string;
        rating: number;
        createdAt: any;
        user: {
            id: string;
            name: string;
            photoURL?: string;
        };
    };
    animeId: string;
    handleDelete: any
};


const RightAction = (handleDelete: any, ref: RefObject<SwipeableMethods | null>, itemId: any) => {
    return (
        <View style={styles.deleteBox}>
            <TouchableOpacity onPress={async () => {
                await handleDelete(itemId);
                ref.current?.reset()
            }}>
                <View style={styles.deleteBox}>
                    <FontAwesome6 name="trash" size={24} color="white"/>
                    <Text style={styles.deleteText}>Удалить</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const getUserPhotoByUID = async (uid: string): Promise<string | null> => {
    try {
        const usersRef = collection(db, "user-collection");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();
            return data.avatarURL || null;
        } else {
            console.warn("Пользователь с таким UID не найден");
            return null;
        }
    } catch (error) {
        console.error("Ошибка при получении фото профиля:", error);
        return null;
    }
};


export const CommentItem = memo(({item, animeId, handleDelete}: CommentItemProps) => {
    const {user} = useAuth();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [ava, setAva] = useState<string | null>(null);
    const ref = useRef<SwipeableMethods | null>(null);

    const isOwner = user?.uid === item.user.id;
    const isDark = useColorScheme() === 'dark';

    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
    }));

    const fetchLikeData = async () => {
        if (!user) {
            const [count, avatar] = await Promise.all([
                getLikesCount({animeId, commentId: item.id}),
                getUserPhotoByUID(item.user.id),
            ]);
            setLikesCount(count);
            setAva(avatar);
            return;
        }
        const [isLiked, count, avatar] = await Promise.all([
            checkIfUserLiked({animeId, commentId: item.id, userId: user.uid}),
            getLikesCount({animeId, commentId: item.id}),
            getUserPhotoByUID(item.user.id),
        ]);
        setLiked(isLiked);
        setLikesCount(count);
        setAva(avatar);
    };

    useEffect(() => {
        fetchLikeData();
    }, []);


    const handleLikeToggle = async () => {
        if (!user) {
            alert("Чтобы ставить лайки, нужно быть авторизованным!");
            return;
        }
        await toggleLikeComment({
            animeId,
            commentId: item.id,
            userId: user.uid,
            liked,
        });
        setLiked(!liked);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

        scale.value = withSpring(1.2, {stiffness: 200}, () => {
            scale.value = withSpring(1);
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    };

    return (
        <View style={{paddingHorizontal: 10}}>
            <ReanimatedSwipeable
                ref={ref}
                friction={2}
                enabled={isOwner}
                enableTrackpadTwoFingerGesture
                rightThreshold={40}
                containerStyle={{flex: 1}}
                renderRightActions={() => RightAction(handleDelete, ref, item.id)}
            >
                <View
                    style={[styles.commentItem, {backgroundColor: isDark ? Colors.dark.background : Colors.light.background}]}>
                    <Image source={{uri: ava || ''}} style={styles.avatar} transition={300} autoplay={true}/>
                    <View style={styles.commentText}>
                        <View style={styles.commentHeader}>
                            <ThemedText style={styles.name}>{item.user.name}</ThemedText>
                            <ThemedText style={styles.date}>
                                {item.createdAt?.seconds
                                    ? new Date(item.createdAt.seconds * 1000).toLocaleString("ru-RU", {
                                        month: "2-digit",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </ThemedText>
                        </View>
                        {item.titleText === 'Без заголовка' ? null : <ThemedText
                            style={{paddingBottom: 10, fontSize: 18, fontWeight: 'bold'}}>{item.titleText}</ThemedText>}
                        <ThemedText>{item.text}</ThemedText>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 10}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                <TouchableOpacity
                                    onPressOut={handleLikeToggle}
                                    activeOpacity={0.6}
                                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                                    style={animatedStyle}
                                >
                                    <AntDesign
                                        name={liked ? "heart" : "hearto"}
                                        size={26}
                                        color={liked ? "red" : "gray"}
                                    />
                                </TouchableOpacity>
                                <ThemedText style={styles.likeCount}>{likesCount}</ThemedText>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                <AntDesign name={'star'} size={22} color={'green'}/>
                                <ThemedText style={[styles.likeCount, {
                                    color: 'green',
                                    fontSize: 22,
                                    textAlignVertical: 'center'
                                }]}>{item.rating}</ThemedText>
                            </View>
                        </View>
                    </View>
                </View>
            </ReanimatedSwipeable>
            <View style={styles.separator}/>
        </View>
    )
});

const styles = StyleSheet.create({
    separator: {
        width: '100%',
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 5,
        borderColor: 'white'
    },
    deleteBox: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 90,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "bold",
    },
    commentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 19,
        marginRight: 10,
    },
    commentText: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        textAlignVertical: "bottom",
    },
    likeCount: {
        fontSize: 16,
        color: "gray",
    },
});
