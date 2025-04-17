import React, { useState, useEffect } from "react";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { onScreenProps, topProps } from "@/constants/QLRequestProps";

interface AnimeListState {
  topRated: ShikimoriAnime[];
  onScreen: ShikimoriAnime[];
}

interface UseAnimeListResult {
  animeList: AnimeListState;
  setAnimeList: React.Dispatch<React.SetStateAction<AnimeListState>>;
}

export const useAnimeList = (): UseAnimeListResult => {
  const [animeList, setAnimeList] = useState<AnimeListState>({
    topRated: [],
    onScreen: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [top, onScreens] = await Promise.allSettled([
        getAnimeList(topProps),
        getAnimeList(onScreenProps),
      ]);

      if (top.status === "fulfilled") {
        setAnimeList((prevState) => ({
          ...prevState,
          topRated: top.value,
        }));
      }
      if (onScreens.status === "fulfilled") {
        setAnimeList((prevState) => ({
          ...prevState,
          onScreen: onScreens.value,
        }));
      }
    };
    fetchData();
  }, []);

  return { animeList, setAnimeList };
};
