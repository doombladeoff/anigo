import React, { createContext, useState, useCallback, ReactNode, useContext, Dispatch, SetStateAction } from 'react';
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { OrderEnum } from "@/constants/OrderEnum";

interface SearchContextType {
    handleSearch: (query: string, filters?: RequestProps) => Promise<void>;
    searchResults: ShikimoriAnime[];
    setSearchResults: Dispatch<SetStateAction<ShikimoriAnime[]>>;
    isLoad: boolean
    loadMore: () => Promise<void>;
    page: number
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({children}: { children: ReactNode }) => {
    const [searchResults, setSearchResults] = useState<ShikimoriAnime[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const handleSearch = useCallback(async (query: string, filters?: RequestProps) => {
        setIsLoad(true);
        const results = await getAnimeList({name: query, limit: 15, ...filters});
        setSearchResults(results);
        setPage(1);
        setIsLoad(false);

    }, [setSearchResults]);

    const loadMore = useCallback(async () => {
        if (isLoad) return;

        setIsLoad(true);
        const filters: RequestProps = {page: page + 1, limit: 15};
        const results = await getAnimeList(filters);

        if (results.length === 0) {
            setIsLoad(false);
            return;
        }

        setSearchResults(prevResults => [...prevResults, ...results]);
        setPage(prevPage => prevPage + 1)
        setIsLoad(false);
    }, [isLoad, page]);

    return (
        <SearchContext.Provider value={{searchResults, handleSearch, isLoad, setSearchResults, loadMore, page}}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error(
            "useSearchContext must be used within an SearchProvider",
        );
    }
    return context;
};