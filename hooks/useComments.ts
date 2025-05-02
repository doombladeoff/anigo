import { useCallback, useEffect, useState } from "react";
import { CustomUser } from "@/context/AuthContext";
import { fetchComments, addCommentToAnime, deleteCommentFromAnime } from "@/utils/firebase/comments";

interface IComment {
    id: string;
    text: string;
    titleText: string;
    rating: number;
    createdAt: any;
    user: {
        id: string;
        name: string;
        photoURL: string;
    };
}

export const useComments = (animeId: string | number, user: CustomUser | null) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [rating, setRating] = useState<number>(1);
    const [text, setText] = useState<string>("");
    const [titleText, setTitleText] = useState<string>("");

    const [loadingSend, setLoadingSend] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [canSend, setCanSend] = useState<boolean>(true);

    const loadComments = useCallback(async () => {
        if (!hasMore) return;
        setLoadingMore(true);
        const {comments: newComments, lastVisible: newLast, hasMore: more} = await fetchComments({
            animeId: animeId.toString(),
            lastDoc: lastVisible,
        });
        setComments(prev => [...prev, ...newComments as IComment[]]);
        setLastVisible(newLast);
        setHasMore(more);
        setLoadingMore(false);
    }, [animeId, lastVisible, hasMore]);

    const handleClearData = useCallback(() => {
        setText('');
        setTitleText('');
        setRating(1);
    }, []);

    const handleDelete = useCallback(async (commentId: string) => {
        await deleteCommentFromAnime({animeId: Number(animeId), commentId});
        setComments(prev => prev.filter((comment) => comment.id !== commentId));
    }, [animeId, setComments]);

    const handleSend = async () => {
        if (!text.trim() || !user) return;
        if (!canSend) return alert("Отправлять можно 1 рза в 10 секунд");

        setLoadingSend(true);
        setCanSend(false);

        const tText = titleText.trim() || "Без заголовка";
        const commID = await addCommentToAnime({
            animeId: Number(animeId),
            text: text.trim(),
            user,
            titleText: tText,
            rating
        });
        const newComment: IComment = {
            id: commID,
            text: text.trim(),
            titleText: tText,
            rating: rating,
            createdAt: new Date(),
            user: {
                id: user.uid,
                name: user.displayName || 'Без имени',
                photoURL: user.avatarURL || user.photoURL || '',
            },
        };

        setComments(prev => [newComment, ...prev]);
        setText("");
        setTitleText("");
        setRating(1);

        setLoadingSend(false);

        setTimeout(() => setCanSend(true), 10000);
    };

    useEffect(() => {
        loadComments();
    }, []);

    return {
        comments,
        text,
        setText,
        titleText,
        setTitleText,
        rating,
        setRating,
        handleSend,
        handleClearData,
        handleDelete,
        loadComments,
        loadingSend,
        loadingMore,
        canSend,
    };
};
