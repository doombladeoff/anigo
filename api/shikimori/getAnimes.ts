import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import client from "@/api/shikimori/client";
import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";

export const GET_ANIMES = gql`
    query GetAnime(
      $search: String
      $ids: String
      $kind: AnimeKindString
      $status: AnimeStatusString
      $limit: Int!
      $order: OrderEnum
      $duration: DurationString
      $rating: RatingString
      $page: Int!
      $season: SeasonString
      $genre: String
    ) {
      animes(
        search: $search
        ids: $ids
        kind: $kind
        status: $status
        limit: $limit
        order: $order
        duration: $duration
        rating: $rating
        page: $page
        season: $season
        genre: $genre
      ) {
        id
        malId
        name
        russian
        licenseNameRu
        english
        japanese
        synonyms
        kind
        rating
        score
        status
        episodes
        episodesAired
        duration
        airedOn {
          year
          month
          day
          date
        }
        releasedOn {
          year
          month
          day
          date
        }
        url
        season

        poster {
          id
          originalUrl
          mainUrl
        }

        fansubbers
        fandubbers
        licensors
        createdAt
        updatedAt
        nextEpisodeAt
        isCensored

        genres {
          id
          name
          russian
          kind
        }
        studios {
          id
          name
          imageUrl
        }

        externalLinks {
          id
          kind
          url
          createdAt
          updatedAt
        }

        personRoles {
          id
          rolesRu
          rolesEn
          person {
            id
            name
            poster {
              id
            }
          }
        }
        characterRoles {
          id
          rolesRu
          rolesEn
          character {
            id
            name
            russian
            poster {
            id 
            mainUrl
            }
          }
        }

        related {
          id
          anime {
            id
            name
          }
          manga {
            id
            name
          }
          relationKind
          relationText
        }

        videos {
          id
          url
          name
          kind
          playerUrl
          imageUrl
        }
        screenshots {
          id
          originalUrl
          x166Url
          x332Url
        }

        scoresStats {
          score
          count
        }
        statusesStats {
          status
          count
        }

        description
      }
    }
  `;
export const getAnimeList = async (
props: RequestProps,
apolloClient?: ApolloClient<NormalizedCacheObject>
) => {
    const {
        name,
        ids,
        kind,
        status,
        limit = 10,
        order,
        duration,
        rating,
        page = 1,
        season,
        genre
    } = props;

    const adjustedLimit = Math.min(limit ?? 2, 50);
    const pageDefault = page ? page : 1;

    const variables = {
        ...(name && {search: name}),
        ...(ids && {ids}),
        ...(kind?.length && {kind: kind.join(",")}),
        ...(status?.length && {status: status.join(",")}),
        ...(duration?.length && {duration: duration.join(",")}),
        ...(rating?.length && {rating: rating.join(",")}),
        order,
        season,
        genre,
        limit: adjustedLimit,
        page: pageDefault,
    };

    try {
        const {data} = await (apolloClient || client).query({
            query: GET_ANIMES,
            variables,
        });
        return data.animes;
    } catch (error) {
        console.error("Error fetching anime list:", error);
        return [];
    }
};

