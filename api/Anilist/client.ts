import { ApolloClient, InMemoryCache } from "@apollo/client";

const anilistClient = new ApolloClient({
    uri: "https://graphql.anilist.co",
    cache: new InMemoryCache(),
});

export default anilistClient;
