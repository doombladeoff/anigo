import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { MutableRefObject } from "react";
import Animated from "react-native-reanimated";
import { create } from "zustand";

interface AnimeStore {
    anime: ShikimoriAnime | null;
    worldArtID: string | null;
    kinopoiskID: string | null;
    status: string | null;

    setAnime: (v: ShikimoriAnime) => void;
    setWorldArtID: (v: string) => void;
    setKinopoiskID: (v: string) => void;
    setStatuss: (v: string) => void;

    targetY: number;
    ref: MutableRefObject<Animated.ScrollView | null>;

    setTargetY?: (v: number) => void;
    setRef?: (v: MutableRefObject<Animated.ScrollView | null>) => void;

    handleClearData: () => void;
}

export const useAnimeStore = create<AnimeStore>((set, get) => ({
    anime: null,
    worldArtID: null,
    kinopoiskID: null,
    status: null,

    setAnime: (v) => set({ anime: v }),
    setWorldArtID: (v) => set({ worldArtID: v }),
    setKinopoiskID: (v) => set({ kinopoiskID: v }),
    setStatuss: (v) => set({ status: v }),

    targetY: 0,
    ref: { current: null } as MutableRefObject<Animated.ScrollView | null>,

    setTargetY: (v) => set({ targetY: v }),
    setRef: (v) => set({ ref: v }),

    handleClearData: async () => {
        set({
            anime: null,
            worldArtID: null,
            kinopoiskID: null,
            targetY: 0,
            ref: { current: null },
            status: null
        })
    }
}));