import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import client from "@/api/shikimori/client";

export const GET_CHARACTERS = gql`
    query GetCharacter(
      $ids: [ID!]
    ) {
        characters(ids: $ids) {
            id
            malId
            name
            russian
            japanese
            synonyms
            url
            createdAt
            updatedAt
            isAnime
            isManga
            isRanobe
        
            poster { id originalUrl mainUrl }
            
            description
        }
    }
  `;

export const getCharacter = async (
    ids: string,
    apolloClient?: ApolloClient<NormalizedCacheObject>
) => {
    try {
        const {data} = await (apolloClient || client).query({
            query: GET_CHARACTERS,
            variables: {ids: Number(ids)}
        });
        return data.characters;
    } catch (error) {
        console.error("Error fetching character:", error);
        return [];
    }
};

