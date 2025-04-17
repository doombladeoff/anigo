import React, { createContext, useContext, useState, ReactNode } from "react";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";

interface AnimeListContextType {
  data: ShikimoriAnime[];
  setAnimeListContext: React.Dispatch<React.SetStateAction<ShikimoriAnime[]>>;
}

const AnimeListContext = createContext<AnimeListContextType | undefined>(
  undefined,
);

export const AnimeListProvider = ({ children }: { children: ReactNode }) => {
  const [data, setAnimeListContext] = useState<ShikimoriAnime[]>([]);

  return (
    <AnimeListContext.Provider value={{ data, setAnimeListContext }}>
      {children}
    </AnimeListContext.Provider>
  );
};

export const useAnimeListContext = (): AnimeListContextType => {
  const context = useContext(AnimeListContext);
  if (!context) {
    throw new Error(
      "useAnimeListContext must be used within an AnimeListProvider",
    );
  }
  return context;
};
