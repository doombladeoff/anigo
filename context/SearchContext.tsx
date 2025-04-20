import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";

interface SearchContextType {
    handleSearch: (query: string, filters?: RequestProps) => Promise<void>;
    searchResults: ShikimoriAnime[];
    isLoad: boolean
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({children}: { children: ReactNode }) => {
    const [searchResults, setSearchResults] = useState<ShikimoriAnime[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false)

    const handleSearch = useCallback(async (query: string, filters?: RequestProps) => {
        if (query) {
            setIsLoad(true);
            const results = await getAnimeList({name: query, limit: 15, ...filters});
            setSearchResults(results);
            setIsLoad(false);
        } else {
            setSearchResults([]);
            setIsLoad(false);
        }
    }, [setSearchResults]);

    return (
        <SearchContext.Provider value={{searchResults, handleSearch, isLoad}}>
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