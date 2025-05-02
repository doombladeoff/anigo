import {
    collection,
    query,
    orderBy,
    startAfter,
    limit,
    getDocs,
    addDoc,
    serverTimestamp,
    doc,
    deleteDoc,
    getDoc,
    setDoc,
    DocumentData,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CustomUser } from "@/context/AuthContext";

const COMMENTS_LIMIT = 10;

const getCommentsRef = (animeId: string) =>
    collection(db, "anime", animeId, "comments");

const getCommentDocRef = (animeId: string, commentId: string) =>
    doc(db, "anime", animeId, "comments", commentId);

const getLikeDocRef = (animeId: string, commentId: string, userId: string) =>
    doc(db, "anime", animeId, "comments", commentId, "likes", userId);


export const fetchComments = async ({animeId, lastDoc = null,}: {
    animeId: string;
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}) => {
    const ref = getCommentsRef(animeId);
    const q = query(
        ref,
        orderBy("createdAt", "desc"),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(COMMENTS_LIMIT)
    );

    const snapshot = await getDocs(q);
    return {
        comments: snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})),
        lastVisible: snapshot.docs.at(-1) || null,
        hasMore: snapshot.docs.length === COMMENTS_LIMIT,
    };
};


export const addCommentToAnime = async ({
    animeId,
    text,
    titleText,
    rating,
    user
}: {
    animeId: number;
    text: string;
    titleText: string;
    rating: number;
    user: CustomUser;
}) => {
    const ref = getCommentsRef(animeId.toString());
    const docRef = await addDoc(ref, {
        text,
        titleText,
        rating,
        createdAt: serverTimestamp(),
        user: {
            id: user.uid,
            name: user.displayName,
            photoURL: user.avatarURL || user.photoURL,
        },
    });
    return docRef.id;
};


export const deleteCommentFromAnime = async ({animeId, commentId}: { animeId: number; commentId: string; }) => {
    await deleteDoc(getCommentDocRef(animeId.toString(), commentId));
};


export const toggleLikeComment = async ({animeId, commentId, userId, liked}: {
    animeId: string;
    commentId: string;
    userId: string;
    liked: boolean;
}) => {
    const likeRef = getLikeDocRef(animeId, commentId, userId);
    liked ? await deleteDoc(likeRef) : await setDoc(likeRef, {createdAt: new Date()});
};


export const checkIfUserLiked = async ({animeId, commentId, userId}: {
    animeId: string;
    commentId: string;
    userId: string;
}) => {
    const likeSnap = await getDoc(getLikeDocRef(animeId, commentId, userId));
    return likeSnap.exists();
};

export const getLikesCount = async ({animeId, commentId}: { animeId: string; commentId: string; }) => {
    const likesSnap = await getDocs(
        collection(db, "anime", animeId, "comments", commentId, "likes")
    );
    return likesSnap.size;
};
