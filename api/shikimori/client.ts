import { ApolloClient, InMemoryCache } from "@apollo/client";
import UserAgent from "user-agents";

const SHIKIMORI_GRAPHQL_URL = "https://shikimori.one/api/graphql";

const client = new ApolloClient({
    uri: SHIKIMORI_GRAPHQL_URL,
    headers: {
        "User-Agent": new UserAgent().toString(),
    },
    cache: new InMemoryCache(),
});

export default client;
