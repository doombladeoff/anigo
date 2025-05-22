import React, { useState, useEffect } from "react";
import { ShikimoriAnime } from "@/interfaces/Shikimori.interfaces";
import { getAnimeList } from "@/api/shikimori/getAnimes";
import { onScreenProps, topProps } from "@/constants/QLRequestProps";
import { AnimeFields } from "@/api/shikimori/AnimeFields.type";

interface AnimeListState {
  topRated: ShikimoriAnime[];
  onScreen: ShikimoriAnime[];
}

interface UseAnimeListResult {
  animeList: AnimeListState;
  setAnimeList: React.Dispatch<React.SetStateAction<AnimeListState>>;
}

const fields: AnimeFields = {
  id: true,
  malId: true,
  poster: { main2xUrl: true },
  russian: true,
  airedOn: { year: true },
  score: true
};

export const useAnimeList = (): UseAnimeListResult => {
  const [animeList, setAnimeList] = useState<AnimeListState>({
    topRated: [],
    onScreen: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [top, onScreens] = await Promise.allSettled([
        getAnimeList(topProps, fields),
        getAnimeList(onScreenProps, fields),
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
