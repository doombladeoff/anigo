import { create } from "zustand";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { AnimeFields } from "@/api/shikimori/AnimeFields.type";
import { OrderEnum } from "@/constants/OrderEnum";
import { defaultFilters } from "@/constants/QLRequestProps";

export type KindValueType = NonNullable<RequestProps['kind']>[number];
export type StatusValueType = NonNullable<RequestProps['status']>[number];
export type DurationValueType = NonNullable<RequestProps['duration']>[number];
export type RatingValueType = NonNullable<RequestProps['rating']>[number];
export type OrderValueType = string;

interface SearchStore {
    searchText: string;
    searchResults: ShikimoriAnime[];
    isLoad: boolean;
    page: number;
    queryText: string;
    lockFetch: boolean;

    kind: string[];
    status: string[];
    duration: string[];
    rating: string[];
    order: string[];
    genre: string[];
    year: number[];

    setKind: (v: string[]) => void;
    setStatus: (v: string[]) => void;
    setDuration: (v: string[]) => void;
    setRating: (v: string[]) => void;
    setOrder: (v: string[]) => void;
    setGenre: (v: string[]) => void;
    setYear: (v: number[]) => void,

    setSearchText: (v: string) => void;
    setSearchResult: (v: []) => void;
    setQueryText: (v: string) => void;
    setPage: (n: number) => void;
    setLockFetch: (b: boolean) => void;

    handleClearFilters: () => void;
    handleSearch: (searchText: string, isNextPage?: boolean, lock?: boolean) => Promise<void>;
}

const searchFields: AnimeFields = {
    id: true,
    malId: true,
    poster: { main2xUrl: true },
    russian: true,
    airedOn: { year: true },
    score: true,
};

export const useSearchStore = create<SearchStore>((set, get) => ({
    searchText: '',
    searchResults: [],
    isLoad: false,
    page: 1,
    queryText: "",
    lockFetch: false,

    kind: defaultFilters.kind ? defaultFilters.kind : [],
    status: defaultFilters.status ? defaultFilters.status : [],
    duration: defaultFilters.duration ? defaultFilters.duration : [],
    rating: defaultFilters.rating ? defaultFilters.rating : [],
    order: defaultFilters.order
        ? Array.isArray(defaultFilters.order)
            ? defaultFilters.order
            : [defaultFilters.order]
        : [OrderEnum.ranked],
    genre: defaultFilters.genre ? defaultFilters.genre : [],
    year: [1990, new Date().getFullYear()],

    setKind: (v) => set({ kind: v }),
    setStatus: (v) => set({ status: v }),
    setDuration: (v) => set({ duration: v }),
    setRating: (v) => set({ rating: v }),
    setOrder: (v) => set({ order: v }),
    setGenre: (v) => set({ genre: v }),
    setYear: (v) => set({ year: v }),

    setSearchText: (v) => set({ searchText: v }),
    setSearchResult: (v) => set({ searchResults: v }),
    setQueryText: (v) => set({ queryText: v }),
    setPage: (n) => set({ page: n }),
    setLockFetch: (b) => set({ lockFetch: b }),


    handleClearFilters: async () => {
        set({
            searchText: '',
            queryText: '',
            kind: [],
            status: [],
            duration: [],
            rating: [],
            order: [OrderEnum.ranked],
            genre: [],
            year: [1990, new Date().getFullYear()],
        });
    },

    handleSearch: async (searchText, isNextPage = false, lock = false) => {
        const { isLoad, lockFetch, page, queryText, kind, status, duration, rating, order, genre, year } = get();

        console.log(lock, lockFetch, isLoad)

        if (lock || lockFetch || isLoad) return;
        set({ isLoad: true });

        if (!isNextPage) {
            set({ queryText: searchText, page: 1, searchResults: [], lockFetch: false });
        } else {
            set((state) => ({ page: state.page + 1 }));
        }

        try {
            const pageToUse = isNextPage ? get().page : 1;
            const effectiveSearchText = isNextPage ? queryText : searchText;
            console.log('years', year)

            const requestParams: RequestProps = {
                name: effectiveSearchText,
                page: pageToUse,
                limit: 14,
                season: `!ancient,${year.join('_')}`,
            };

            if (kind.length > 0) requestParams.kind = kind as KindValueType[]
            else requestParams.kind = ["tv", "movie", "ova", "ona", "special", "tv_special"];
            if (status.length > 0) requestParams.status = status as StatusValueType[];
            if (duration.length > 0) requestParams.duration = duration as DurationValueType[];
            if (rating.length > 0) requestParams.rating = rating as RatingValueType[];
            else requestParams.rating = ['pg_13', 'r', 'r_plus'];
            if (order.length > 0) requestParams.order = order[0];
            if (genre.length > 0) requestParams.genre = genre;

            console.log("🔍 Request:", requestParams);

            const results = await getAnimeList(requestParams, searchFields);

            if (results.length === 0) {
                set({ lockFetch: true });
                return;
            }

            set((state) => ({
                searchResults: isNextPage ? [...state.searchResults, ...results] : results,
            }));
        } catch (error) {
            console.error("Ошибка при поиске:", error);
        } finally {
            set({ isLoad: false });
        }
    }

}));
