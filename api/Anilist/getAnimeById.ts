import { gql } from "@apollo/client";
import anilistClient from "./client";

export const GET_ANIME_BY_MAL_ID = gql`
  query ($idMal: Int) {
    Media(idMal: $idMal, type: ANIME) {
      id
      coverImage {
        extraLarge
        large
      }
      bannerImage
      externalLinks {
      site
      url
    }
    streamingEpisodes{
      url
    }
    }
  }
`;

export const getAnimeByMalId = async (malId: number) => {
  try {
    const { data } = await anilistClient.query({
      query: GET_ANIME_BY_MAL_ID,
      variables: { idMal: malId },
    });
    return data?.Media;
  } catch (err) {
    console.error("AniList API error:", err);
    return null;
  }
};